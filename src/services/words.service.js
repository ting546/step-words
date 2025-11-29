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
      updatedAt: Number(updatedItem.updatedAt),
      createdAt: updatedItem.createdAt ? Number(updatedItem.createdAt) : undefined,
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
// const moduleService = {
//   /**
//    * Fetches all modules from the database.
//    * @returns A promise that resolves to an array of module objects.
//    */
//   async getAllmodules() {
//     try {
//       const modules = await prisma.module.findMany();
//       // console.log("All Word Lists:", modules); // Consider removing console.logs from services
//       return modules;
//     } catch (error) {
//       console.error("Error fetching all word lists:", error);
//       throw error; // Re-throw the error for upstream handling
//     }
//   },

//   /**
//    * Fetches a single module by its ID.
//    * @param id The ID of the module to fetch.
//    * @returns A promise that resolves to a module object or null if not found.
//    */
//   async getmoduleById(id) {
//     try {
//       const module = await prisma.module.findUnique({
//         where: { id },
//       });
//       return module;
//     } catch (error) {
//       console.error(`Error fetching word list with ID ${id}:`, error);
//       throw error;
//     }
//   },

//   /**
//    * Fetches a module and its associated Words by module ID.
//    * @param id The ID of the module to fetch.
//    * @returns A promise that resolves to a module object with Words or null.
//    */
//   async getmoduleWithPairs(id) {
//     try {
//       const moduleWithPairs = await prisma.module.findUnique({
//         where: { id },
//         include: { Words: true }, // Eager load the related Words
//       });
//       return moduleWithPairs;
//     } catch (error) {
//       console.error(`Error fetching word list with pairs for ID ${id}:`, error);
//       throw error;
//     }
//   },

//   // You can add more methods here for creating, updating, or deleting modules
//   // For example:
//   /*
//   async createModule(data: { name: string; author: string; description?: string }) {
//     try {
//       const newmodule = await prisma.module.create({
//         data: {
//           ...data,
//           updatedAt: Date.now(),
//         },
//       });
//       return newmodule;
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
//     const allLists = await moduleService.getAllmodules();
//     console.log("Fetched All Word Lists count:", allLists.length);

//     // If you have a specific ID, you can try fetching it
//     // const specificListId = 'some_actual_id_from_your_db';
//     // if (specificListId) {
//     //   console.log(`\nFetching word list by ID: ${specificListId}`);
//     //   const singleList = await moduleService.getmoduleById(specificListId);
//     //   console.log("Fetched single module:", singleList);
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
// export default moduleService;
