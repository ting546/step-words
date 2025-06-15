import { NextResponse } from "next/server";
import prisma from "../../lib/db";

export async function GET() {
  try {
    const wordLists = await prisma.wordList.findMany({
      include: {
        words: {
          orderBy: {
            word1: "asc",
          },
        },
      },
      orderBy: { updateTime: "desc" },
    });
    console.log(wordLists);
    const serialized = wordLists.map((item) => ({
      ...item,
      updateTime: Number(item.updateTime),
      createTime: Number(item.createTime),
    }));

    return NextResponse.json(serialized);
  } catch (error) {
    console.error("Ошибка при получении wordLists:", error);
    return new NextResponse("Ошибка сервера", { status: 500 });
  }
}

// Создать новый модуль
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, author, description, settings, words } = body;

    const newList = await prisma.wordList.create({
      data: {
        name,
        author,
        description,
        updateTime: Date.now(),
        createTime: Date.now(),
        settings,
        words: {
          create: words.map((w: any) => ({
            word1: w.word1,
            word2: w.word2,
            progress: w.progress || "new",
          })),
        },
      },
      include: {
        words: {
          orderBy: {
            word1: "asc",
          },
        },
      },
    });

    const serialized = {
      ...newList,
      updateTime: Number(newList.updateTime),
      createTime: Number(newList.createTime),
    };

    return NextResponse.json(serialized, { status: 201 });
  } catch (error) {
    console.error("Ошибка при создании wordList:", error);
    return new NextResponse("Ошибка сервера", { status: 500 });
  }
}
