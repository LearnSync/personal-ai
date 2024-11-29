import { PersistStorage } from "zustand/middleware";
import superjson from "superjson";
import { createStore } from "idb-keyval";

export const storage: PersistStorage<any> = {
  getItem: (key) => {
    const item = localStorage.getItem(key) as string;
    return superjson.parse(item);
  },
  setItem: (key, value) => {
    localStorage.setItem(key, superjson.stringify(value));
  },
  removeItem: (key) => {
    localStorage.removeItem(key);
  },
};

export const idbStorage = () => {
  const store = createStore("localfirst-store", "storage");

  return {
    getItem: async (name: string) => {
      const { get } = await import("idb-keyval");
      try {
        return await get(name, store);
      } catch (error) {
        console.error("Error retrieving item from IndexedDB:", error);
        return null;
      }
    },
    setItem: async (name: string, value: any) => {
      const { set } = await import("idb-keyval");
      try {
        await set(name, value, store);
      } catch (error) {
        console.error("Error setting item in IndexedDB:", error);
      }
    },
    removeItem: async (name: string) => {
      const { del } = await import("idb-keyval");
      try {
        await del(name, store);
      } catch (error) {
        console.error("Error removing item from IndexedDB:", error);
      }
    },
  };
};
