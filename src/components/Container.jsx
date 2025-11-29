"use client";
import { useAppContext } from "../context/context";

const Container = ({ children }) => {
  const { isOpenHeader } = useAppContext();
  return (
    <div
      className={`transition-all duration-300 max-w-350 ease m-auto pr-3 pl-3 ${isOpenHeader ? "lg:pl-64" : "pl-0"}`}>
      {children}
    </div>
  );
};
export default Container;
