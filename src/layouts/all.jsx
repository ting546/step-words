"use client";
import { useAppContext } from "../context/context";
import { Geist, Geist_Mono } from "next/font/google";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export default function AllLayout({ children }) {
  const { isOpenHeader } = useAppContext();
  return (
    <html lang="ru">
      <body
        className={`transition-all duration-300 ease-in-out ${isOpenHeader ? "pl-64" : ""} ${
          geistSans.variable
        } ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
