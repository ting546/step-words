// app/modules/[id]/page.js (Server Component)
"use server";
import { notFound } from "next/navigation";
import Container from "../../../components/Container";
import ModuleClient from "./ModuleClient";
import prisma from "../../../lib/db";
const Module = async ({ params }) => {
  const { id: wordId } = await params;
  let data;
  try {
    data = await prisma.wordList.findUnique({
      where: {
        id: wordId, // замените 1 на нужный вам id
      },
      include: {
        words: {
          orderBy: {
            word1: "asc",
          },
        },
      },
    });
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error);
    if (error.response?.status === 404 || error.message.includes("Not Found")) {
      notFound();
    }
    throw error;
  }

  if (!data) {
    notFound();
  }
  // Вычисляем статистику на сервере

  return (
    <section className="pt-30 pb-10">
      <Container>
        <div className="max-w-200 m-auto">
          <ModuleClient initialData={data} wordId={wordId} />
        </div>
      </Container>
    </section>
  );
};

export default Module;
