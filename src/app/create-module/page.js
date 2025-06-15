"use client";
import Container from "../../components/Container";
import Title from "../../components/Title";
import Input from "../../Ui/Input";
import Textarea from "../../Ui/Textarea";
import WordsItem from "../../components/WordsItem";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import wordService from "../../services/words.service";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-hot-toast";
const CreateModule = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deletingIndexes, setDeletingIndexes] = useState([]);
  const [myData, setMyData] = useState({
    id: uuidv4(),
    name: "",
    author: "Вы",
    description: "",
    updateTime: Number(Date.now()),
    createTime: Number(Date.now()),
    settings: {
      side: "ru",
    },
    words: [
      {
        id: uuidv4(),
        word1: "",
        word2: "",
        progress: "studied",
      },
    ],
  });
  const useTranslateApi = async (value) => {
    const translated = await wordService.getTranslate(value);
    return translated[0][0];
  };

  const { mutate: addNewItem } = useMutation({
    mutationFn: (newItem) => wordService.createModule(newItem),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["words-item"] });
      router.push(`/module/${myData.id}`);
      toast.success("Модуль создан");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Ошибка создания");
    },
  });

  const saveWords = async () => {
    const translatedWords = await Promise.all(
      myData.words.map(async (word) => {
        const translated = await useTranslateApi(word.word1);
        return { ...word, word2: translated };
      })
    );

    const newModule = {
      ...myData,
      words: translatedWords,
    };
    setMyData(newModule);
    addNewItem(newModule);
  };

  const addNewWords = () => {
    const obj = {
      id: uuidv4(),
      word1: "",
      word2: "",
      progress: "studied",
    };
    setMyData((prev) => ({ ...prev, words: [...prev.words, obj] }));
  };

  // Функция для обновления конкретного слова
  const updateWord = (index, updatedWords) => {
    setMyData((prev) => {
      const newWords = [...prev.words];
      newWords[index] = {
        id: newWords[index].id,
        ...updatedWords,
        progress: newWords[index].progress,
      };
      return {
        ...prev,
        words: newWords,
      };
    });
  };

  return (
    <section className="pt-30 pb-20">
      <Container>
        <Title className="mb-15">Создать модуль</Title>
        <button
          onClick={saveWords}
          className="cursor-pointer text-xl p-3 rounded-2xl bg-green-700 mb-6 ml-auto block">
          Создать
        </button>
        <Input
          className="mb-10"
          placeholder={"Название"}
          type={"text"}
          onChange={(val) => setMyData((prev) => ({ ...prev, name: val.target.value }))}
          value={myData?.name}
        />
        <Textarea
          className="mb-10"
          placeholder={"Описание"}
          type={"text"}
          onChange={(val) => setMyData((prev) => ({ ...prev, description: val.target.value }))}
          value={myData?.description}
        />
        <div className="mb-10">
          {myData?.words.map((word, index) => {
            const isDeleting = deletingIndexes.includes(index);
            return (
              <div
                key={word.id}
                className={`${isDeleting ? "fade-out" : "transition-all duration-300"}`}>
                <WordsItem
                  deleteModule={() => {
                    setDeletingIndexes((prev) => [...prev, index]);
                    setTimeout(() => {
                      const updatedWords = myData.words.filter((_, idx) => idx !== index);
                      setMyData((prev) => ({ ...prev, words: updatedWords }));
                      setDeletingIndexes((prev) => prev.filter((i) => i !== index));
                    }, 300);
                  }}
                  onSendWord={(words) => updateWord(index, words)}
                  dataWord1={word.word1}
                  dataWord2={word.word2}
                  index={index}
                />
              </div>
            );
          })}
        </div>

        <button
          onClick={addNewWords}
          className="group cursor-pointer bg-gray-900 hover:bg-gray-800 transition-all ease-in p-6 rounded-md w-full justify-center items-center gap-2 text-xl text-center flex">
          <p>Добавить блок</p>
          <Plus size={26} strokeWidth={2} className="group-hover:rotate-135 transition-all" />
        </button>
      </Container>
    </section>
  );
};

export default CreateModule;
