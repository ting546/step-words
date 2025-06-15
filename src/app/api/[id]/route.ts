import { NextResponse } from "next/server";
import prisma from "../../../lib/db"; // путь подстрой под свой

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

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
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { id, words, ...wordListData } = body;

    // Обновляем сам WordList
    const updatedWordList = await prisma.wordList.update({
      where: { id: params.id },
      data: {
        ...wordListData,
      },
    });

    // Собираем текущие id слов с клиента
    const incomingWordIds = words.map((word: any) => word.id).filter(Boolean);

    // Получаем текущие слова в БД для сравнения
    const existingWords = await prisma.wordPair.findMany({
      where: { wordListId: params.id },
    });

    const existingWordIds = existingWords.map((w) => w.id);

    // Удаляем слова, которых больше нет в списке
    const wordsToDelete = existingWordIds.filter((id) => !incomingWordIds.includes(id));

    await prisma.wordPair.deleteMany({
      where: {
        id: { in: wordsToDelete },
      },
    });

    // Обновляем или создаем слова
    const upsertPromises = words.map((word: any) => {
      const { id, ...wordData } = word;
      return prisma.wordPair.upsert({
        where: { id: id || "___invalid" }, // если id нет — создаём
        update: wordData,
        create: {
          ...wordData,
          wordListId: params.id,
        },
      });
    });

    await Promise.all(upsertPromises);

    // Загружаем обновленный WordList вместе с новыми словами
    const fullUpdated = await prisma.wordList.findUnique({
      where: { id: params.id },
      include: {
        words: {
          orderBy: [
            { word1: "asc" },
            { id: "asc" }, // добавляем для полной стабильности
          ],
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
    console.error("Ошибка при обновлении WordList с words[]:", error);
    return new NextResponse("Ошибка сервера", { status: 500 });
  }
}

// Удалить модуль (DELETE)
export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await prisma.wordList.delete({
      where: { id },
    });

    return new NextResponse("Модуль удалён", { status: 200 });
  } catch (error) {
    console.error("Ошибка при удалении wordList:", error);
    return new NextResponse("Ошибка сервера", { status: 500 });
  }
}
