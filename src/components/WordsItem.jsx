"use client";
import { useState, useEffect } from "react";
import { Trash } from "lucide-react";
import Input from "../Ui/Input";
import wordsService from "../services/words.service";

const WordsItem = ({ dataWord1, dataWord2, index, deleteModule, onSendWord }) => {
  const [words, setWords] = useState({
    word1: dataWord1 || "",
    word2: dataWord2 || "",
  });

  // Синхронизируем локальное состояние с пропсами
  useEffect(() => {
    setWords({
      word1: dataWord1 || "",
      word2: dataWord2 || "",
    });
  }, [dataWord1, dataWord2]);

  const useTranslateApi = async (value) => {
    const translated = await wordsService.getTranslate(value);
    return translated[0][0];
  };

  const handleChange = (key, value) => {
    const updated = { ...words, [key]: value };
    setWords(updated);
    // Отправляем изменения сразу при вводе
    onSendWord(updated, "wtire");
  };

  const handleBlur1 = async (e) => {
    const translatedText = await useTranslateApi(e.target.value);
    const updated = { ...words, word2: translatedText };
    setWords(updated);
    onSendWord(updated);
  };

  const handleKey1 = async (e) => {
    if (e.key === "Enter") {
      const translatedText = await useTranslateApi(e.target.value);
      const updated = { ...words, word2: translatedText };
      setWords(updated);
      onSendWord(updated);
    }
  };

  const handleBlur = () => {
    onSendWord(words);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") {
      onSendWord(words);
    }
  };

  return (
    <div className="p-6 bg-gray-900 rounded-md mb-5">
      <div className="flex justify-between mb-4 pb-4 border-b-1">
        <p className="p-2 bg-gray-600 w-10 h-10 rounded-md items-center justify-center flex">
          {index + 1}
        </p>
        <button
          onClick={deleteModule}
          className="group cursor-pointer w-10 h-10 items-center justify-center flex">
          <Trash className="group-hover:text-red-700 transition-all" />
        </button>
      </div>
      <div className="grid sm:grid-cols-2 gap-2">
        <Input
          placeholder="На английском"
          type="text"
          value={words.word1}
          onChange={(e) => handleChange("word1", e.target.value)}
          onBlur={handleBlur1}
          onKeyDown={handleKey1}
        />
        <Input
          placeholder="На русском"
          type="text"
          value={words.word2}
          onChange={(e) => handleChange("word2", e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKey}
        />
      </div>
    </div>
  );
};

export default WordsItem;
