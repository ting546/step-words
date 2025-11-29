"use client";
import { BookOpen } from "lucide-react";
import Link from "next/link";

const RecentModules = ({ className, data }) => {
 
  const wordsByData = () => {
    return [...data].sort((a, b) => {
      if (a.updateTime > b.updateTime) return -1;
      if (a.updateTime < b.updateTime) return 1;
      return 0;
    });
  };
  return (
    <>
      <div className={className}>
        <div className="flex justify-between items-center  mb-5  gap-5">
          <h2 className="font-bold text-xl">Недвание</h2>
          <Link className="underline" href="/modules">
            Все модули
          </Link>
        </div>
        <div className="grid md:grid-cols-2">
          {wordsByData()
            .slice(0, 4)
            .map((word) => (
              <Link
                key={word.id}
                className="flex items-center justify-start gap-4 p-6 hover:bg-gray-800 rounded-md ease-in transition-all"
                href={`/module/${word.id}`}>
                <div className="shrink-0 p-2 bg-orange-400 rounded-md">
                  <BookOpen />
                </div>
                <div>
                  <p className="font-medium mb-1">{word.name}</p>
                  <p>
                    Модуль - {word.words.length} слов - Автор: {word.author}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </>
  );
};
export default RecentModules;
