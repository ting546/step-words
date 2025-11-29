import { PrismaClient, Prisma } from "../src/generated/prisma";

const prisma = new PrismaClient();

const ModulesData: Prisma.ModuleCreateInput[] = [
  {
    id: "70307fa9-cb2c-46c7-8a1b-79318eb6796c", // если хочешь задавать id вручную
    name: "English words 1",
    author: "Вы",
    description: "Описание",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    settings: {
      side: "ru", // если у тебя settings - json, смотри ниже
    },
    words: {
      create: [
        {
          id: "c9de5cdd-9d89-4a4a-b0c5-97b889c5f5b5",
          word1: "HEllo",
          word2: "Привет",
          progress: "LEARNED",
        },
        {
          id: "54baca65-07c3-46ee-83bc-a917c2ecf54e",
          word1: "Here",
          word2: "Здесь",
          progress: "STUDIED",
        },
        {
          id: "0f05e96c-6047-4163-a319-e7c62920477f",
          word1: "How",
          word2: "Как",
          progress: "LEARNED",
        },
        {
          id: "151fad99-8d42-40a4-a581-af0f310fc9a2",
          word1: "Word",
          word2: "Слово",
          progress: "STUDIED",
        },
      ],
    },
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const u of ModulesData) {
    const Module = await prisma.module.create({
      data: u,
    });
    console.log(`Created Module with id: ${Module.id}`);
  }
  console.log(`Seeding finished.`);
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
