import { NextResponse, NextRequest } from "next/server";
import prisma from "../../../lib/db"; // путь подстрой под свой
interface Params {
  id: string;
}
export async function GET(request: Request, { params }: { params: Params }) {
  const { id } = await params;

  try {
    const module = await prisma.module.findUnique({
      where: { id },
      include: { words: { orderBy: { word1: "asc" } } },
    });

    if (!module) return NextResponse.json({ error: "Модуль не найден" }, { status: 404 });

    return NextResponse.json({
      ...module,
      createdAt: Number(module.createdAt),
      updatedAt: Number(module.updatedAt),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

// Обновить модуль (PATCH)
export async function PATCH(request: Request, { params }: { params: Params }) {
  const { id: prId } = await params;

  try {
    const body = await request.json();
    const { words, ...moduleData } = body;

    // Обновляем сам module
    const updatedmodule = await prisma.module.update({
      where: { id: prId },
      data: {
        ...moduleData,
      },
    });

    const incomingWordIds = words.map((w) => w.id).filter(Boolean);
    const existingWords = await prisma.word.findMany({
      where: { moduleId: prId },
    });

    const existingWordIds = existingWords.map((w) => w.id);
    const wordsToDelete = existingWordIds.filter((id) => !incomingWordIds.includes(id));

    await prisma.word.deleteMany({
      where: { id: { in: wordsToDelete } },
    });

    const upsertPromises = words.map((word) => {
      const { id, ...wordData } = word;

      if (id) {
        return prisma.word.update({
          where: { id },
          data: wordData,
        });
      } else {
        return prisma.word.create({
          data: {
            ...wordData,
            moduleId: prId,
          },
        });
      }
    });

    await Promise.all(upsertPromises);

    const fullUpdated = await prisma.module.findUnique({
      where: { id: prId },
      include: {
        words: {
          orderBy: [{ word1: "asc" }, { id: "asc" }],
        },
      },
    });

    const serialized = {
      ...fullUpdated,
      updatedAt: Number(fullUpdated?.updatedAt),
      createdAt: Number(fullUpdated?.createdAt),
    };

    return NextResponse.json(serialized);
  } catch (error) {
    console.error("Ошибка при обновлении module:", error);
    return new NextResponse("Ошибка сервера", { status: 500 });
  }
}

// Удалить модуль (DELETE)
export async function DELETE(request: Request, { params }: { params: Params }) {
  const { id } = await params;

  try {
    await prisma.word.deleteMany({
      where: {
        moduleId: id,
      },
    });

    await prisma.module.delete({
      where: { id },
    });

    return new NextResponse("Модуль удалён", { status: 200 });
  } catch (error) {
    console.error("Ошибка при удалении module:", error);
    return new NextResponse("Ошибка сервера", { status: 500 });
  }
}
