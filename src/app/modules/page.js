"use client";
import Container from "../../components/Container";
import Title from "../../components/Title";
import { Search, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import Dateitem from "../../components/DateItem";
import Load from "../../components/Load";
import wordsService from "../../services/words.service";
const Modules = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["words"],
    queryFn: wordsService.getWords,
  });
  const [searchText, setSearchText] = useState("");

  if (isLoading) return <Load />;
  if (isError) return <h1>Данные не найдены или произошла ошибка.</h1>;

  const getSearchItems = () => {
    return [...data].filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()));
  };

  const filterByTimeRange = (min, max, unit = "hours") => {
    const unitMap = {
      seconds: 1000,
      minutes: 1000 * 60,
      hours: 1000 * 60 * 60,
    };

    const now = Date.now();
    console.log(data);
    console.log(isLoading);

    return data?.filter((item) => {
      const diff = now - item.updatedAt;
      const value = Math.floor(diff / unitMap[unit]);
      return value >= min && value < max;
    });
  };

  const sortItemsBySecond = () => filterByTimeRange(1, 60, "seconds") || [];
  const sortItemsByMinutes = () => filterByTimeRange(1, 30, "minutes") || [];
  const sortItemsByHalfHour = () => filterByTimeRange(30, 60, "minutes") || [];
  const sortItemsByHour = () => filterByTimeRange(1, 3, "hours") || [];
  const sortItemsByToday = () => filterByTimeRange(3, 24, "hours") || [];
  const sortItemsByWeek = () => filterByTimeRange(24, 168, "hours") || [];
  const sortItemsByMonth = () => filterByTimeRange(168, 720, "hours") || [];
  const sortItemsByOld = () => filterByTimeRange(720, Infinity, "hours") || [];
  return (
    <section className="pt-30 pb-20">
      <Container>
        <Title className="mb-6 sm:mb-14">Ваши модули</Title>
        <div className="relative mb-7">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 z-30 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Найти карточки"
            className="w-full pl-10 pr-4 py-2 rounded-md border focus:border-gray-500 bg-gray-800 text-white placeholder-gray-400 border-transparent focus:outline-none  focus:bg-transparent transition-all"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {!!searchText && (
          <div className="">
            {getSearchItems().map((word) => (
              <Link
                key={word.id}
                className="hover:border-b-3  hover:border-gray-200 border-b-3 border-transparent mb-4 block bg-gray-700 rounded-lg p-3"
                href={`/module/${word.id}`}>
                <div className="flex gap-2 mb-1 text-sm">
                  <p className="font-bold">Термины: {word.words.length}</p>-
                  <p>Автор: {word.author}</p>
                </div>
                <p className="font-bold text-xl">{word.name}</p>
              </Link>
            ))}
          </div>
        )}
        {!searchText && (
          <div className="">
            {!!sortItemsBySecond().length && (
              <>
                <Dateitem title="Пару секунд назад" func={sortItemsBySecond} />
              </>
            )}
            {!!sortItemsByMinutes().length && (
              <>
                <Dateitem title="Пару минут назад" func={sortItemsByMinutes} />
              </>
            )}
            {!!sortItemsByHalfHour().length && (
              <>
                <Dateitem title="В течение часа" func={sortItemsByHalfHour} />
              </>
            )}
            {!!sortItemsByHour().length && (
              <>
                <Dateitem title="Пару часов назад" func={sortItemsByHour} />
              </>
            )}
            {!!sortItemsByToday().length && (
              <>
                <Dateitem title="Сегодня" func={sortItemsByToday} />
              </>
            )}
            {!!sortItemsByWeek().length && (
              <>
                <Dateitem title="На этой неделе" func={sortItemsByWeek} />
              </>
            )}
            {!!sortItemsByMonth().length && (
              <>
                <Dateitem title="В этом месяце" func={sortItemsByMonth} />
              </>
            )}
            {!!sortItemsByOld().length && (
              <>
                <Dateitem title="Давно" func={sortItemsByOld} />
              </>
            )}
            <Link
              className="group bg-gray-900 hover:bg-gray-800 transition-all ease-in p-6 rounded-md w-full justify-center items-center gap-2 text-xl text-center flex"
              href="/create-module">
              <p>Добавить модуль</p>
              <Plus size={26} strokeWidth={2} className="group-hover:rotate-135 transition-all" />
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
};
export default Modules;
