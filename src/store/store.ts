import { DEFAULT_EXTENSIONS_ITEMS } from "@/constants";
import { create } from "zustand";

interface StoreState {
  showSideBar: boolean;
  activeExtensionTab: string;
  setActiveExtensionTab: (tab: string) => void;
  setShowSideBar: (value: boolean) => void;
}

export const useStore = create<StoreState>((set) => ({
  // Get
  activeExtensionTab: DEFAULT_EXTENSIONS_ITEMS[0].label,
  showSideBar: true,

  // Set
  setActiveExtensionTab: (tab: string) => set({ activeExtensionTab: tab }),
  setShowSideBar: (value: boolean) => set({ showSideBar: value }),
}));

export default useStore;
