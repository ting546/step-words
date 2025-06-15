"use client";
import { useEffect, useRef, useState } from "react";
import { Check, Pen } from "lucide-react";
const WordChanger = ({ word, onSendWord }) => {
  const [isInputVisiable, setIsInputVisiable] = useState(false);
  const [curText, setCurText] = useState(word);

  const wordRef = useRef(word);
  useEffect(() => {
    setCurText(word);
  }, [word]);
  const textChange = () => {
    setIsInputVisiable(true);
    wordRef.current.focus();
  };
  const textChanged = () => {
    setIsInputVisiable(false);
    setCurText(wordRef.current.innerText.trim());
    onSendWord(wordRef.current.innerText.trim());
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setIsInputVisiable(false);
      setCurText(wordRef.current.innerText.trim());
      onSendWord(wordRef.current.innerText.trim());
    }
  };
  useEffect(() => {
    wordRef.current.focus();
    const range = document.createRange();
    const selection = window.getSelection();

    range.selectNodeContents(wordRef.current);
    range.collapse(false); // false = курсор в конец

    selection.removeAllRanges();
    selection.addRange(range);
  }, [isInputVisiable]);
  return (
    <>
      <span
        className={`max-w-50 outline-0 ${isInputVisiable ? "border-b" : ""} `}
        contentEditable={isInputVisiable ? "true" : "false"}
        ref={wordRef}
        onKeyDown={handleKeyDown}
        dangerouslySetInnerHTML={{ __html: curText }}></span>
      <button
        type="button"
        onClick={textChange}
        className={`cursor-pointer opacity-0 group-hover:opacity-100 ${
          isInputVisiable && "hidden"
        }`}>
        <Pen size={15} />
      </button>
      <button
        type="button"
        onClick={textChanged}
        className={`cursor-pointer opacity-0 group-hover:opacity-100 ${
          !isInputVisiable && "hidden"
        }`}>
        <Check size={17} color="lime" />
      </button>
    </>
  );
};
export default WordChanger;
