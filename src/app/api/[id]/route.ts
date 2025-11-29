import { NextResponse, NextRequest } from "next/server";
import prisma from "../../../lib/db"; // путь подстрой под свой

export async function GET(_request: NextRequest, context: { params: { id: string } }) {
  const id = _request.nextUrl.pathname.split("/").pop(); // или через regex

  try {
    const wordList = await prisma.wordList.findUnique({
      where: { id },
      include: {
        words: {
          orderBy: {
            word1: "asc",
          },
        },
      },
    });

    if (!wordList) {
      return new NextResponse("Модуль не найден", { status: 404 });
    }

    const serialized = {
      ...wordList,
      updateTime: Number(wordList.updateTime),
      createTime: Number(wordList.createTime),
    };

    return NextResponse.json(serialized);
  } catch (error) {
    console.error("Ошибка при получении wordList по ID:", error);
    return new NextResponse("Ошибка сервера", { status: 500 });
  }
}

// Обновить модуль (PATCH)
export async function PATCH(request: NextRequest, { params }) {
  const { id: prId } = await params;

  try {
    const body = await request.json();
    const { words, ...wordListData } = body;

    // Обновляем сам wordList
    const updatedWordList = await prisma.wordList.update({
      where: { id: prId },
      data: {
        ...wordListData,
      },
    });

    const incomingWordIds = words.map((w) => w.id).filter(Boolean);
    const existingWords = await prisma.wordPair.findMany({
      where: { wordListId: prId },
    });

    const existingWordIds = existingWords.map((w) => w.id);
    const wordsToDelete = existingWordIds.filter((id) => !incomingWordIds.includes(id));

    await prisma.wordPair.deleteMany({
      where: { id: { in: wordsToDelete } },
    });

    const upsertPromises = words.map((word) => {
      const { id, ...wordData } = word;

      if (id) {
        return prisma.wordPair.update({
          where: { id },
          data: wordData,
        });
      } else {
        return prisma.wordPair.create({
          data: {
            ...wordData,
            wordListId: prId,
          },
        });
      }
    });

    await Promise.all(upsertPromises);

    const fullUpdated = await prisma.wordList.findUnique({
      where: { id: prId },
      include: {
        words: {
          orderBy: [{ word1: "asc" }, { id: "asc" }],
        },
      },
    });

    const serialized = {
      ...fullUpdated,
      updateTime: Number(fullUpdated?.updateTime),
      createTime: Number(fullUpdated?.createTime),
    };

    return NextResponse.json(serialized);
  } catch (error) {
    console.error("Ошибка при обновлении WordList:", error);
    return new NextResponse("Ошибка сервера", { status: 500 });
  }
}

// Удалить модуль (DELETE)
export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await prisma.wordPair.deleteMany({
      where: {
        wordListId: id,
      },
    });

    await prisma.wordList.delete({
      where: { id },
    });

    return new NextResponse("Модуль удалён", { status: 200 });
  } catch (error) {
    console.error("Ошибка при удалении wordList:", error);
    return new NextResponse("Ошибка сервера", { status: 500 });
  }
}
