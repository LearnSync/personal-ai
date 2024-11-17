import { PersistStorage } from "zustand/middleware";
import superjson from "superjson";

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
