"use server";

import prisma from "../lib/db";

export async function updateWords(updatedItem) {
  console.log("sad");
  console.log(updatedItem);
  // return await prisma.wordList.update({
  //   where: { id: updatedItem.id },
  //   data: {
  //     words: {
  //       set: [],
  //       create: words,
  //     },
  //     settings,
  //   },
  // });
}
