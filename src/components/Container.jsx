"use client";
import { useAppContext } from "../context/context";

const Container = ({ children }) => {
  const { isOpenHeader } = useAppContext();
  return (
    <div
      className={`transition-all duration-300 ease m-auto pr-3 pl-3 ${
        isOpenHeader ? "max-w-320" : "max-w-350"
      }`}>
      {children}
    </div>
  );
};
export default Container;
