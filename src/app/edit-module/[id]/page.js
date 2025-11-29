"use client";
import Container from "../../../components/Container";
import Title from "../../../components/Title";
import Input from "../../../Ui/Input";
import Textarea from "../../../Ui/Textarea";
import WordsItem from "../../../components/WordsItem";
import { Plus } from "lucide-react";
import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import wordService from "../../../services/words.service";
import Load from "../../../components/Load";
import { v4 as uuidv4 } from "uuid";
const EditModule = ({ params }) => {
  const unwrappedParams = use(params);
  const wordId = unwrappedParams.id;
  const navigate = useRouter();
  const queryClient = useQueryClient();
  const [deletingIndexes, setDeletingIndexes] = useState([]);
  const [myData, setMyData] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["words-item", wordId],
    queryFn: () => wordService.getWordsById(wordId),
  });

  const { mutate: updateWords } = useMutation({
    mutationFn: wordService.updatedWordItem,
    onSuccess: (updatedItem) => {
      queryClient.setQueryData(["words-item", updatedItem.id], updatedItem);
    },
  });

  const { mutate: deleteModule } = useMutation({
    mutationFn: (wordId) => wordService.deleteModule(wordId),
    onSuccess: () => {
      navigate.push("/modules");
      queryClient.invalidateQueries(["words-item", wordId]);
    },
  });

  const autoSave = useCallback(
    (dataToSave) => {
      updateWords({ ...dataToSave });
    },
    [updateWords]
  );

  useEffect(() => {
    if (data) {
      if (!myData || myData.id !== data.id) {
        setMyData({ ...data });
      }
    }
  }, [data, myData]);

  if (isLoading) return <Load />;
  if (isError) return <h1>Данные не найдены или произошла ошибка.</h1>;

  const saveWords = () => {
   
    autoSave(myData);
    navigate.push(`/module/${wordId}`);
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

  return (
    <section className="pt-20 sm:pt-30 pb-20">
      <Container>
        <Title className="mb-8 sm:mb-15">Редактировать модуль</Title>
        <div className="flex gap-5 justify-end">
          <button
            onClick={saveWords}
            className="cursor-pointer sm:text-xl p-3 rounded-2xl bg-green-700 mb-6 block">
            Сохранить
          </button>
          <button
            onClick={() => deleteModule(wordId)}
            className="cursor-pointer sm:text-xl p-3 rounded-2xl bg-red-700 mb-6 block">
            Удалить
          </button>
        </div>
        <Input
          className="mb-5 sm:mb-10"
          placeholder={"Название"}
          type={"text"}
          onChange={(val) => setMyData((prev) => ({ ...prev, name: val.target.value }))}
          value={myData?.name}
        />
        <Textarea
          className="mb-5 sm:mb-10"
          placeholder={"Описание"}
          type={"text"}
          onChange={(val) => setMyData((prev) => ({ ...prev, description: val.target.value }))}
          value={myData?.description}
        />
        <div className="mb-5 sm:mb-10">
          {myData?.words.map((word, index) => {
            const isDeleting = deletingIndexes.includes(index);
            return (
              <div
                key={word.id}
                className={`${isDeleting ? "fade-out" : "transition-all duration-200"}`}>
                <WordsItem
                  deleteModule={() => {
                    setDeletingIndexes((prev) => [...prev, index]);
                    setTimeout(() => {
                      const updatedWords = myData.words.filter((_, idx) => idx !== index);
                      const updatedData = { ...myData, words: updatedWords };
                      setMyData(updatedData);
                      setDeletingIndexes((prev) => prev.filter((i) => i !== index));
                      // Автосохранение после удаления
                      autoSave(updatedData);
                    }, 300);
                  }}
                  onSendWord={(words, write) => {
                    const updatedWords = [...myData.words];
                    updatedWords[index] = { id: word.id, ...words, progress: word.progress };
                    const updatedData = { ...myData, words: updatedWords };

                    setMyData(updatedData);
                    
                    if (!write) {
                      console.log('!wtire')
                      setTimeout(() => {
                        autoSave(updatedData);
                      }, 100);
                    }
                  }}
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

export default EditModule;
