import { NextResponse, NextRequest } from "next/server";
import prisma from "../../lib/db";

export async function GET() {
  try {
    const modules = await prisma.module.findMany({
      include: {
        words: {
          orderBy: {
            word1: "asc",
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const serialized = modules.map((item) => ({
      ...item,
      createdAt: Number(item.createdAt), // конвертируем BigInt в число
      updatedAt: Number(item.updatedAt),
      words: item.words.map((w) => ({
        ...w,
      })),
    }));

    return NextResponse.json(serialized);
  } catch (error) {
    console.error("Ошибка при получении modules:", error);
    return new NextResponse("Ошибка сервера", { status: 500 });
  }
}

// Создать новый модуль
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { words, ...moduleData } = body;

    // создаём модуль
    const createdModule = await prisma.module.create({
      data: {
        ...moduleData,
      },
    });

    // создаём слова с moduleId
    await prisma.word.createMany({
      data: words.map((w) => ({
        ...w,
        moduleId: createdModule.id,
      })),
    });

    // получаем модуль с созданными словами
    const full = await prisma.module.findUnique({
      where: { id: createdModule.id },
      include: {
        words: {
          orderBy: { word1: "asc" },
        },
      },
    });

    // сериализуем BigInt
    const serialized = full
      ? {
          ...full,
          createdAt: Number(full.createdAt),
          updatedAt: Number(full.updatedAt),
          words: full.words.map((w) => ({ ...w })),
        }
      : null;

    return NextResponse.json(serialized);
  } catch (e) {
    console.error("Ошибка при создании модуля:", e);
    return new NextResponse("Ошибка сервера", { status: 500 });
  }
}
