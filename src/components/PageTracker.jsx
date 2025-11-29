"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAppContext } from "../context/context";
export default function PageTracker() {
  const { isOpenHeader, setIsOpenHeader } = useAppContext();
  const pathname = usePathname();
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      setIsOpenHeader(false)  
      prevPath.current = pathname;
    }
  }, [pathname]);

  return null;
}
