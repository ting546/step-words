import { useEffect, useState } from "react";
import Speach from "../utils/speach";
import { Volume2, Lightbulb } from "lucide-react";
const FlipCard = ({ word1, word2, side, style, fli }) => {
  const [flipped, setFlipped] = useState(side == "ru" ? true : false);
  const [clue1, setСlue1] = useState(false);
  const [clue2, setСlue2] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setFlipped(side == "ru" ? true : false);
    }, 100);
  }, [fli]);
  useEffect(() => {
    setFlipped((prev) => !prev);
  }, [side]);
  const Сlue = (word) => {
    const worddd = word.split("").map(() => {
      return "_";
    });
    return word[0] + worddd.join("");
  };
  return (
    <div style={style} className={`absolute w-full h-full top-0 left-0 card`}>
      <div className="w-full h-full  absolute rounded-2xl z-21 bg-gray-950"></div>
      <div
        className="relative h-full z-50 cursor-pointer transform-gpu transition-all duration-300 ease-in-out"
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
        }}
        onClick={() => {
          setFlipped((prev) => !prev);
          if (flipped) {
            Speach(word1, "en-US");
          } else {
            Speach(word2, "ru-RU");
          }
        }}>
        <div
          className={`relative w-full h-full transition-transform duration-300 z-50 ease-in-out transform-gpu ${
            flipped ? "rotate-y-180" : ""
          }`}
          style={{ transformStyle: "preserve-3d" }}>
          <div
            className="absolute w-full h-full backface-hidden"
            style={{ backfaceVisibility: "hidden" }}>
            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900  rounded-2xl p-6 flex flex-col items-center justify-center shadow-2xl backdrop-blur-sm">
              {side == "en" && (
                <button
                  className="absolute top-5 left-5 cursor-pointer flex items-center gap-2 text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setСlue1((prev) => !prev);
                  }}>
                  <Lightbulb size={14} />
                  {clue1 ? Сlue(word2) : "Показать подсказку"}
                </button>
              )}

              <button
                className="absolute top-5 right-5 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  Speach(word1, "en-US");
                }}>
                <Volume2 size={20} />
              </button>
              <div className="relative z-10 text-center">
                <p className="text-3xl font-bold text-white mb-2">{word1}</p>
              </div>
            </div>
          </div>

          <div
            className="absolute w-full h-full backface-hidden transform rotate-y-180"
            style={{ backfaceVisibility: "hidden" }}>
            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900  rounded-2xl p-6 flex flex-col items-center justify-center shadow-2xl backdrop-blur-sm">
              {side == "ru" && (
                <button
                  className="absolute top-5 left-5 cursor-pointer flex items-center gap-2 text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setСlue2((prev) => !prev);
                  }}>
                  <Lightbulb size={14} />
                  {clue2 ? Сlue(word1) : "Показать подсказку"}
                </button>
              )}

              <button
                className="absolute top-5 right-5    cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  Speach(word2, "ru-RU");
                }}>
                <Volume2 size={20} />
              </button>
              <div className="relative z-10 text-center">
                <p className="text-3xl font-bold text-white mb-2">{word2}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
