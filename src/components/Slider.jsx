"use client";
import { Check, X, Undo2 } from "lucide-react";
import FlipCard from "./FlipCard";
import Speach from "../utils/speach";

import { useState, useEffect } from "react";
const Slider = ({ words, data, updateDb, endSlide, success }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [unlock, setUnlock] = useState(true);
  const [fli, setFli] = useState(false);
  const [animating, setAnimating] = useState(false);

  const [slideDirection, setSlideDirection] = useState("");
  useEffect(() => {
    if (success === false) {
      // Сразу блокируем клики
      setUnlock(false);

      // Через 1 секунду разрешаем снова нажимать
      const timer = setTimeout(() => {
        setUnlock(true);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [success]);
  useEffect(() => {
    const lang = data?.settings.side == "ru" ? "ru-RU" : "en-US";
    const speachWord =
      data?.settings.side == "ru" ? words?.[currentIndex]?.word2 : words?.[currentIndex]?.word1;
    if (speachWord) {
      Speach(speachWord, lang);
    }
  }, []);

  const getWordstyle = (index) => {
    const diff = (index - currentIndex + words.length) % words.length;
    if (diff === 0) {
      // Текущая карточка - анимируем в зависимости от направления
      let translateX = "0px";
      let translateY = "0px";
      let rotate = "0deg";

      if (animating && slideDirection === "right") {
        translateX = "150px";
        rotate = "15deg";
      } else if (animating && slideDirection === "left") {
        translateX = "-150px";
        rotate = "-15deg";
      } else if (animating && slideDirection === "back") {
        translateY = "100px";
        rotate = "0deg";
      }

      return {
        transform: `translateX(${translateX}) translateY(${translateY}) scale(${
          animating ? "0.8" : "1"
        }) rotate(${rotate})`,
        zIndex: 30,
        opacity: animating ? 0 : 1,
      };
    } else if (diff === 1 && slideDirection !== "back") {
      // Следующая карточка - появляется снизу при движении вперед
      return {
        transform: `translateX(0px) translateY(${animating ? "0px" : "0px"}) scale(${
          animating ? "1" : "0.9"
        })`,
        zIndex: 20,
        opacity: animating ? 1 : 0.3,
      };
    } else if (diff === words.length - 1 && slideDirection === "back") {
      // Предыдущая карточка - появляется сверху при движении назад
      return {
        transform: `translateX(0px) translateY(${animating ? "0px" : "-50px"}) scale(${
          animating ? "1" : "0.9"
        })`,
        zIndex: 20,
        opacity: animating ? 1 : 0.3,
      };
    } else {
      // Скрытые карточки
      return {
        transform: "translateX(0px) translateY(100px) scale(0.8)",
        zIndex: 10,
        opacity: 0,
      };
    }
  };

  const handlePrev = () => {
    const lang = data?.settings.side == "ru" ? "ru-RU" : "en-US";
    const speachWord =
      data?.settings.side == "ru"
        ? words?.[currentIndex - 1]?.word2
        : words?.[currentIndex - 1]?.word1;
    setFli((prev) => !prev);
    Speach(speachWord, lang);
    if (animating) return;
    setAnimating(true);
    setSlideDirection("back");

    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + words.length) % words.length);
      setSlideDirection("");
      setAnimating(false);
    }, 300);
  };

  const nextCard = (action) => {
    const lang = data?.settings.side == "ru" ? "ru-RU" : "en-US";
    const speachWord =
      data?.settings.side == "ru"
        ? words?.[currentIndex + 1]?.word2
        : words?.[currentIndex + 1]?.word1;
    setFli((prev) => !prev);

    if (action === "LEARNED") {
      setSlideDirection("right");
    } else if (action === "STUDIED") {
      setSlideDirection("left");
    }
    if (currentIndex == words.length - 1) {
      endSlide();
    }
    if (animating) return;

    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
      if (!!words[currentIndex + 1]) {
        Speach(speachWord, lang);
      }
      setSlideDirection("");
      setAnimating(false);
    }, 300);
    const currentWord = words[currentIndex];

    if (action === currentWord.progress) return;
    const updatedWord = { ...currentWord, progress: action };
    const newWords = data.words.map((word) => (word.id === currentWord.id ? updatedWord : word));
   
    updateDb(newWords);
  };
  return (
    <>
      <div className="relative w-full h-75 sm:h-105">
        <div
          className={`absolute z-100 text-1xl text-red-500 font-bold transition-all duration-300 ${
            slideDirection === "left"
              ? "top-0 -left-20 opacity-100 animate-ping"
              : "top-20 -left-0 opacity-0"
          }`}>
          Не знаю
        </div>
        {words?.map((word, index) => (
          <FlipCard
            key={word.id}
            style={getWordstyle(index)}
            word1={word.word1}
            word2={word.word2}
            fli={fli}
            side={data.settings.side}
          />
        ))}
        <div
          className={`absolute z-100 text-1xl text-green-500 font-bold transition-all duration-300 ${
            slideDirection === "right"
              ? "top-0 -right-20 opacity-100 animate-ping"
              : "top-20 -right-0 opacity-0"
          }`}>
          Знаю
        </div>
      </div>
      <div className="w-full h-1 mb-5 mt-5 bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-600 to-green-700 rounded-full transition-all duration-200 ease-out"
          style={{
            width: `${((currentIndex + 1) / words?.length) * 100}%`,
          }}
        />
      </div>
      <div className="flex mb-5 sm:justify-center items-center gap-20 relative">
        <div className="flex justify-center items-center relative">
          <button
            onClick={() => {
              nextCard("STUDIED");
            }}
            disabled={success}
            className={`cursor-pointer z-100 rounded-4xl border hover:bg-gray-700 transition-all border-gray-700 pt-3 pr-6 pb-3 pl-7 ${
              success ? "pointer-events-none" : ""
            }`}>
            <X color="red" size={40} />
          </button>
          <p className="font-medium mx-3">
            {currentIndex + 1} / {words?.length}
          </p>

          <button
            onClick={() => {
              nextCard("LEARNED");
            }}
            disabled={success}
            className={`cursor-pointer z-100 rounded-4xl border hover:bg-gray-700 transition-all border-gray-700 pt-3 pr-6 pb-3 pl-7 ${
              success ? "pointer-events-none" : ""
            }`}>
            <Check color="lime" size={40} />
          </button>
        </div>
        <button
          disabled={currentIndex == 0 ? true : false}
          onClick={handlePrev}
          className="cursor-pointer  ml-auto absolute right-0 rounded-4xl border hover:bg-gray-700 transition-all border-gray-700 pt-2 pr-4 pb-2 pl-4">
          <Undo2 size={20} />
        </button>
      </div>
    </>
  );
};
export default Slider;
