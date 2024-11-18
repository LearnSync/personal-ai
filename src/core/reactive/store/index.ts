import { PersistStorage } from "zustand/middleware";
import superjson from "superjson";
import localforage from "localforage";

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

export const storageIndexDb: PersistStorage<any> = {
  getItem: async (key) => {
    return await localforage.getItem(key);
  },
  setItem: async (key, value) => {
    await localforage.setItem(key, value);
  },
  removeItem: async (key) => {
    await localforage.removeItem(key);
  },
};
