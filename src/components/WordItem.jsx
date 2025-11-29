import { Trash } from "lucide-react";
import WordChanger from "./WordChanger";
const WordItem = ({ word1, word2, onClick, onSendWord }) => {
  return (
    <div className="flex mb-4 items-center bg-gray-800 pt-4  pr-6 pb-4 pl-6 rounded-xl transition-all duration-300">
      <div className="flex gap-3 sm:gap-0 sm:items-center font-medium text-md relative flex-col sm:flex-row">
        <p className="group flex items-center gap-1  sm:absolute left-0 ">
          <WordChanger onSendWord={(val) => onSendWord(val, "word1")} word={word1} />
        </p>

        <span className="absolute h-6 w-0.5 bg-gray-700 left-36 hidden sm:left-56 sm:block "></span>
        <p className="group sm: flex items-center gap-1 sm:ml-60">
          <WordChanger onSendWord={(val) => onSendWord(val, "word2")} word={word2} />
        </p>
      </div>
      <button className="group cursor-pointer text-md font-medium p-3 rounded-2xl ml-auto block">
        <Trash className="group-hover:text-red-700 transition-all" onClick={onClick} />
      </button>
    </div>
  );
};
export default WordItem;
