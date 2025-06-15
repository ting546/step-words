'use client'
import { createContext, useState, useContext } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [isOpenHeader, setIsOpenHeader] = useState(false);

  return (
    <AppContext.Provider value={{ isOpenHeader, setIsOpenHeader }}>{children}</AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
