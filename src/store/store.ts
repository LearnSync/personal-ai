import { create } from "zustand";

interface StoreState {
  showSideBar: boolean;
  setShowSideBar: (value: boolean) => void;
}

export const useStore = create<StoreState>((set) => ({
  // Get
  showSideBar: true,

  // Set
  setShowSideBar: (value: boolean) => set({ showSideBar: value }),
}));

export default useStore;
