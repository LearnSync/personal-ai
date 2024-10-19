import { DEFAULT_EXTENSIONS_ITEMS } from "@/constants";
import { create } from "zustand";

interface StoreState {
  activeExtensionTab: string;
  setActiveExtensionTab: (tab: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  activeExtensionTab: DEFAULT_EXTENSIONS_ITEMS[0].label,
  setActiveExtensionTab: (tab: string) => set({ activeExtensionTab: tab }),
}));

export default useStore;
