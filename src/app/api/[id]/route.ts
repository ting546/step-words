import { NextResponse, NextRequest } from "next/server";
import prisma from "../../../lib/db";

// Получить модуль по ID
export async function GET(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  if (!id) return new NextResponse("ID не указан", { status: 400 });

  try {
    const foundModule  = await prisma.module.findUnique({
      where: { id },
      include: { words: { orderBy: { word1: "asc" } } },
    });

    if (!foundModule ) return new NextResponse("Модуль не найден", { status: 404 });

    return NextResponse.json({
      ...foundModule ,
      createdAt: Number(foundModule .createdAt),
      updatedAt: Number(foundModule .updatedAt),
    });
  } catch (e) {
    console.error(e);
    return new NextResponse("Ошибка сервера", { status: 500 });
  }
}

// Обновить модуль
export async function PATCH(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  if (!id) return new NextResponse("ID не указан", { status: 400 });

  try {
    const body = await request.json();
    const { words, ...moduleData } = body;

    await prisma.module.update({
      where: { id },
      data: moduleData,
    });

    const incomingWordIds = words.map((w: any) => w.id).filter(Boolean);
    const existingWords = await prisma.word.findMany({ where: { moduleId: id } });
    const wordsToDelete = existingWords
      .map((w) => w.id)
      .filter((wId) => !incomingWordIds.includes(wId));

    await prisma.word.deleteMany({ where: { id: { in: wordsToDelete } } });

    await Promise.all(
      words.map((word: any) => {
        if (word.id) {
          return prisma.word.update({ where: { id: word.id }, data: word });
        } else {
          return prisma.word.create({ data: { ...word, moduleId: id } });
        }
      })
    );

    const updatedModule = await prisma.module.findUnique({
      where: { id },
      include: { words: { orderBy: [{ word1: "asc" }, { id: "asc" }] } },
    });

    return NextResponse.json({
      ...updatedModule,
      createdAt: Number(updatedModule?.createdAt),
      updatedAt: Number(updatedModule?.updatedAt),
    });
  } catch (e) {
    console.error(e);
    return new NextResponse("Ошибка сервера", { status: 500 });
  }
}

// Удалить модуль
export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  if (!id) return new NextResponse("ID не указан", { status: 400 });

  try {
    await prisma.word.deleteMany({ where: { moduleId: id } });
    await prisma.module.delete({ where: { id } });

    return new NextResponse("Модуль удалён", { status: 200 });
  } catch (e) {
    console.error(e);
    return new NextResponse("Ошибка сервера", { status: 500 });
  }
}
