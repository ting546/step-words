"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useAppContext } from "../context/context";
const Header = () => {
  const { isOpenHeader, setIsOpenHeader } = useAppContext();

  return (
    <>
      <button
        onClick={() => setIsOpenHeader((prev) => !prev)}
        className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md shadow-lg cursor-pointer">
        {isOpenHeader ? <X size={24} /> : <Menu size={24} />}
      </button>

      <header
        className={`fixed  top-0 left-0 -translate-x-full  h-full w-64 bg-gray-900 shadow-lg p-5 z-41 transform transition-transform duration-300 ease-in-out ${
          isOpenHeader ? "translate-x-0" : "-translate-x-full"
        }`}>
        <div className="mt-15">
          <nav>
            <ul className="space-y-4">
              <li>
                <Link className="text-lg font-medium  text-blue-50 hover:text-blue-600" href="/">
                  Главная
                </Link>
              </li>
              <li>
                <Link
                  className="text-lg font-medium  text-blue-50 hover:text-blue-600"
                  href="/modules">
                  Модули
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
};
export default Header;
