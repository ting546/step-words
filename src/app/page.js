import Container from "../components/Container";
import Title from "../components/Title";
import { Plus } from "lucide-react";
import RecentModules from "../components/RecentModules";
import Link from "next/link";
import prisma from "../lib/db";
const Home = async () => {
  const data = await prisma.wordList.findMany({
    include: {
      words: true,
    },
  });

  return (
    <section className="pt-20 sm:pt-30 pb-20">
      <Container>
        <Title className="mb-8 sm:mb-20">Привет продолжим?</Title>
        <RecentModules className="mb-10" data={data} />
        <Link
          className="group bg-gray-900 hover:bg-gray-800 transition-all ease-in p-6 rounded-md w-full justify-center items-center gap-2 text-xl text-center flex"
          href="/create-module">
          <p>Добавить модуль</p>
          <Plus size={26} strokeWidth={2} className="group-hover:rotate-135 transition-all" />
        </Link>
      </Container>
    </section>
  );
};
export default Home;
