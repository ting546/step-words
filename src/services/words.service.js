import axios from "axios";

const URL = "http://localhost:3000/api";
export default {
  async getWords() {
    const { data } = await axios.get(URL);
    return data;
  },

  async getWordsById(id) {
    const { data } = await axios.get(`${URL}/${id}`);
    return data;
  },

  async createModule(wordObject) {
    const { data } = await axios.post(URL, wordObject);
    return data;
  },

  async deleteModule(id) {
    const { data } = await axios.delete(`${URL}/${id}`);
    return data;
  },
  async updatedWordItem(updatedItem) {
    const data = {
      ...updatedItem,
      updateTime: Number(updatedItem.updateTime),
      createTime: updatedItem.createTime ? Number(updatedItem.createTime) : undefined,
    };
    const res = await axios.patch(`${URL}/${updatedItem.id}`, data);
    return res.data;
  },

  async getTranslate(text) {
    const { data } = await axios.get(
      `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=auto&tl=ru&q=${text}`
    );
    return data;
  },
};

// import { PrismaClient } from "@/generated/prisma"; // Adjust this path if necessary

// const prisma = new PrismaClient();

// // This object will contain your database operations
// const wordListService = {
//   /**
//    * Fetches all WordLists from the database.
//    * @returns A promise that resolves to an array of WordList objects.
//    */
//   async getAllWordLists() {
//     try {
//       const wordLists = await prisma.wordList.findMany();
//       // console.log("All Word Lists:", wordLists); // Consider removing console.logs from services
//       return wordLists;
//     } catch (error) {
//       console.error("Error fetching all word lists:", error);
//       throw error; // Re-throw the error for upstream handling
//     }
//   },

//   /**
//    * Fetches a single WordList by its ID.
//    * @param id The ID of the WordList to fetch.
//    * @returns A promise that resolves to a WordList object or null if not found.
//    */
//   async getWordListById(id) {
//     try {
//       const wordList = await prisma.wordList.findUnique({
//         where: { id },
//       });
//       return wordList;
//     } catch (error) {
//       console.error(`Error fetching word list with ID ${id}:`, error);
//       throw error;
//     }
//   },

//   /**
//    * Fetches a WordList and its associated WordPairs by WordList ID.
//    * @param id The ID of the WordList to fetch.
//    * @returns A promise that resolves to a WordList object with WordPairs or null.
//    */
//   async getWordListWithPairs(id) {
//     try {
//       const wordListWithPairs = await prisma.wordList.findUnique({
//         where: { id },
//         include: { wordPairs: true }, // Eager load the related wordPairs
//       });
//       return wordListWithPairs;
//     } catch (error) {
//       console.error(`Error fetching word list with pairs for ID ${id}:`, error);
//       throw error;
//     }
//   },

//   // You can add more methods here for creating, updating, or deleting WordLists
//   // For example:
//   /*
//   async createWordList(data: { name: string; author: string; description?: string }) {
//     try {
//       const newWordList = await prisma.wordList.create({
//         data: {
//           ...data,
//           updateTime: Date.now(),
//         },
//       });
//       return newWordList;
//     } catch (error) {
//       console.error("Error creating word list:", error);
//       throw error;
//     }
//   },
//   */
// };

// // ---
// // Important: Disconnecting Prisma Client

// // In a typical application (like a web server or a long-running process),
// // you generally initialize PrismaClient once and keep the connection open.
// // You only disconnect it when your application is shutting down.

// // If this service is part of a larger application, the `main()` function
// // and `finally` block for disconnecting Prisma might be handled
// // at a higher level (e.g., in your application's entry point).

// // For a simple script where you want to ensure disconnection after all operations:
// async function runExamples() {
//   try {
//     console.log("Fetching all word lists...");
//     const allLists = await wordListService.getAllWordLists();
//     console.log("Fetched All Word Lists count:", allLists.length);

//     // If you have a specific ID, you can try fetching it
//     // const specificListId = 'some_actual_id_from_your_db';
//     // if (specificListId) {
//     //   console.log(`\nFetching word list by ID: ${specificListId}`);
//     //   const singleList = await wordListService.getWordListById(specificListId);
//     //   console.log("Fetched single WordList:", singleList);
//     // }
//   } catch (e) {
//     console.error("An error occurred during service operations:", e);
//     process.exit(1); // Exit with an error code
//   } finally {
//     // Ensure Prisma Client is disconnected when all operations are done
//     console.log("\nDisconnecting Prisma Client...");
//     await prisma.$disconnect();
//     console.log("Prisma Client disconnected.");
//   }
// }

// // If this file is meant to be runnable directly as a script:
// // runExamples();

// // If this file is meant to be imported as a module in another part of your app:
// export default wordListService;
