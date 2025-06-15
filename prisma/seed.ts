import { PrismaClient, Prisma } from "../src/generated/prisma";

const prisma = new PrismaClient();

const wordListsData: Prisma.WordListCreateInput[] = [
  {
    id: "70307fa9-cb2c-46c7-8a1b-79318eb6796c", // если хочешь задавать id вручную
    name: "English words 1",
    author: "Вы",
    description: "",
    updateTime: BigInt(1749895806843),
    createTime: BigInt(1749240592482),  // если добавил createTime в схему
    settings: {
      side: "ru", // если у тебя settings - json, смотри ниже
    },
    words: {
      create: [
        {
          id: "c9de5cdd-9d89-4a4a-b0c5-97b889c5f5b5",
          word1: "HEllo",
          word2: "Привет",
          progress: "learned",
        },
        {
          id: "54baca65-07c3-46ee-83bc-a917c2ecf54e",
          word1: "Here",
          word2: "Здесь",
          progress: "studied",
        },
        {
          id: "0f05e96c-6047-4163-a319-e7c62920477f",
          word1: "How",
          word2: "Как",
          progress: "learned",
        },
        {
          id: "151fad99-8d42-40a4-a581-af0f310fc9a2",
          word1: "Word",
          word2: "Слово",
          progress: "studied",
        },
      ],
    },
  },
];

export async function main() {
  // Очистим базу перед вставкой
  await prisma.wordPair.deleteMany({});
  await prisma.wordList.deleteMany({});

  for (const wl of wordListsData) {
    await prisma.wordList.create({
      data: wl,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed finished.");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
