"use client";

import { useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import debounce from "../../../utils/debounce";
import ProgressProvider from "../../../components/ProgressProvider";
import WordGroup from "../../../components/WordGroup";
import Slider from "../../../components/Slider";
import Select from "../../../Ui/Select";
import wordsService from "../../../services/words.service";

const ModuleClient = ({ initialData, wordId }) => {
  const [data, setData] = useState(initialData);

  const [mniArr, setMniArr] = useState([]);
  const [isHidSlider, setIsHidSlider] = useState(false);
  const [isShow, setIsShow] = useState(false);

  const [updating, setUpdating] = useState(false);

  const navigation = useRouter();
  const queryClient = useQueryClient();

  // Пересчитываем статистику при изменении данных
  const studiedSteps = data.words.filter((word) => word.progress === "studied").length;
  const learnedSteps = data.words.filter((word) => word.progress === "learned").length;

  const { mutate: deleteModule } = useMutation({
    mutationFn: (wordId) => wordsService.deleteModule(wordId),
    onSuccess: () => {
      queryClient.removeQueries(["words-item", wordId]);
      navigation.push("/modules");
    },
    onError: (error) => {
      console.error("Ошибка при удалении модуля:", error);
    },
  });

  const { mutate: updateWords } = useMutation({
    mutationFn: wordsService.updatedWordItem,
    onMutate: () => {
      setUpdating(true); 
    },
    onSuccess: (updatedData) => {
      setData(updatedData); 
      queryClient.invalidateQueries(["words-item", wordId]); 
    },
    onError: (error) => {
      console.error("Ошибка при обновлении:", error);
    },
    onSettled: () => {
      
      setUpdating(false); 
    },
  });

  const handledeleteModule = (indexToDelete) => {
    const updatedWords = data.words.filter((_, index) => index !== indexToDelete);
    const updatedItem = { ...data, words: updatedWords };
    setData(updatedItem);
    updateWords(updatedItem);
  };

  const handleChangeWord = async (val, wordKey, idx) => {
    try {
      const translated = await wordsService.getTranslate(val);
      const translatedWord = translated[0][0];
      const newWords = data.words.map((w, i) =>
        i === idx ? { ...w, [wordKey]: val, word2: translatedWord } : w
      );
      const updatedData = { ...data, words: newWords };
      setData(updatedData);

      updateWords(updatedData);
    } catch (error) {
      console.error("Ошибка при переводе:", error);
    }
  };

  const updateDb = (newWords) => {
    const updatedData = { ...data, updateTime: Number(Date.now()), words: [...newWords] };
    setData(updatedData);
    updateWords(updatedData);
  };

  const handleSettingsChange = (e) => {
    const updatedData = {
      ...data,
      settings: { ...data.settings, side: e.target.value },
    };
    setData(updatedData);
    updateWords(updatedData);
  };

  return (
    <>
      {isHidSlider && !updating && (
        <>
          <h1 className="text-left text-3xl mb-7 font-bold">
            {learnedSteps === data.words.length &&
              "Вы настоящий профессионал! Все карточки рассортированы."}
            {learnedSteps > 0 &&
              learnedSteps !== data.words.length &&
              "Прекрасный результат! Продолжайте в том же духе, чтобы закрепить знания."}
            {learnedSteps === 0 && "Не отчаивайтесь! У вас еще все впереди!"}
          </h1>
          <div className="mb-5 flex gap-15">
            <div>
              <h2 className="font-bold text-2xl mb-5">Ваши успехи </h2>
              <div className="flex gap-5">
                <div>
                  <div className="w-35">
                    <ProgressProvider
                      valueStart={0}
                      valueEnd={(learnedSteps / data.words.length) * 100}>
                      {(value) => (
                        <CircularProgressbar
                          className="font-medium"
                          background="bg-red-600"
                          value={value}
                          text={`${Math.round(value)}%`}
                          styles={{
                            background: {
                              fill: "transparent",
                            },
                            text: {
                              fill: "#fff",
                              fontSize: "20px",
                            },
                            path: {
                              stroke: "#18f53e",
                            },
                            trail: {
                              stroke: "oklch(70.7% 0.022 261.325)",
                            },
                          }}
                        />
                      )}
                    </ProgressProvider>
                  </div>
                </div>
                <ul className="w-60">
                  <li className="relative rounded-4xl mb-3 flex justify-between gap-2 pt-2 pr-4 pb-2 pl-4 bg-green-400/20">
                    <span className="text-green-300 font-bold">Знаю</span>
                    <span>{learnedSteps}</span>
                  </li>
                  <li className="relative rounded-4xl mb-3 flex justify-between gap-2 pt-2 pr-4 pb-2 pl-4 bg-orange-400/20">
                    <span className="text-orange-300 font-bold">Еще изучаю</span>
                    <span>{studiedSteps}</span>
                  </li>
                  <li className="relative rounded-4xl mb-3 flex justify-between gap-2 pt-2 pr-4 pb-2 pl-4 bg-gray-400/20">
                    <span className="text-gray-300 font-bold">Всего терминов</span>
                    <span>{data.words.length}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="">
              <h2 className="font-bold text-2xl mb-5">Следующие шаги</h2>
              <button
                onClick={() => {
                  setIsHidSlider(false);
                }}
                className="cursor-pointer flex mb-5 w-full justify-center items-center gap-2 text-md font-medium p-5 rounded-4xl hover:bg-blue-800 bg-blue-600 transition-all ">
                <RefreshCcw />
                Пройти карточки заново
              </button>
              {!!studiedSteps && (
                <button
                  onClick={() => {
                    setIsShow(true);
                    setIsHidSlider(false);
                    setMniArr([...data.words.filter((word) => word.progress === "studied")]);
                  }}
                  className="cursor-pointer w-full justify-center flex items-center gap-2 text-md font-medium p-5 rounded-4xl hover:bg-blue-800 transition-all border border-gray-700">
                  Подучить еще ({studiedSteps})
                </button>
              )}
              {!studiedSteps && (
                <Link
                  href="/"
                  className="cursor-pointer w-full justify-center flex items-center gap-2 text-md font-medium p-5 rounded-4xl hover:bg-blue-800 transition-all border border-gray-700">
                  На главную
                </Link>
              )}
            </div>
          </div>
        </>
      )}
      {!isHidSlider && (
        <>
          <div className="flex mb-10 justify-between items-center gap-4">
            <div>
              <h1 className="text-left text-3xl mb-2 font-bold">{data.name}</h1>
              {data.description && <p>{data.description}</p>}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <p>Сторона:</p>
              <Select
                selectedVal={data.settings.side}
                options={[
                  { val: "en", text: "Английский" },
                  { val: "ru", text: "Русский" },
                ]}
                onChange={handleSettingsChange}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                deleteModule(wordId);
              }}
              className="cursor-pointer text-md font-medium p-3 rounded-2xl bg-red-700 ml-auto block">
              Удалить модуль
            </button>
          </div>
          {isShow && (
            <>
              {mniArr.length && (
                <Slider
                  words={mniArr}
                  updateDb={updateDb}
                  data={data}
                  endSlide={() => {
                    setTimeout(() => {
                      setIsHidSlider(true);
                      setIsShow(false);
                    }, 100);
                  }}
                />
              )}
            </>
          )}
          {!isShow && (
            <Slider
              words={data.words}
              updateDb={updateDb}
              data={data}
              endSlide={() => {
                setTimeout(() => {
                  setIsHidSlider((prev) => !prev);
                }, 100);
              }}
            />
          )}
          <h2 className="mb-5 text-2xl font-medium">Термины в модуле ({data.words.length})</h2>
          <WordGroup
            words={data.words || []}
            title="Изучено"
            description="Вы начали изучать эти термины. Продолжайте!"
            progressType="studied"
            onDelete={(index) => handledeleteModule(index)}
            onChange={(val, key, index) => handleChangeWord(val, key, index)}
          />
          <WordGroup
            words={data.words || []}
            title="Усвоено"
            description="Вы хорошо усвоили эти термины!"
            progressType="learned"
            onDelete={(index) => handledeleteModule(index)}
            onChange={(val, key, index) => handleChangeWord(val, key, index)}
          />
          <Link
            className="cursor-pointer block text-center m-auto max-w-100 rounded-4xl border border-gray-700 p-6 hover:bg-blue-800 transition-all"
            href={`/edit-module/${data.id}`}>
            Добавить или удалить термины
          </Link>
        </>
      )}
    </>
  );
};

export default ModuleClient;
