import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { ESetting } from "@/components/workbench/settings";
import { idbStorage } from "@/core/reactive/store";

interface StoreState {
  // State
  showSideBar: boolean;
  settings: {
    selectedItem: ESetting;
  };

  // Actions
  setShowSideBar: (value: boolean) => void;
  setSettingsSelectedItem: (item: ESetting) => void;
}

export const useLocalFirstStore = create<StoreState>()(
  devtools(
    persist(
      (set) => ({
        // Default State
        showSideBar: true,
        settings: {
          selectedItem: ESetting.GENERAL,
        },

        // Actions
        setShowSideBar: (value: boolean) => set({ showSideBar: value }),
        setSettingsSelectedItem: (item: ESetting) =>
          set({
            settings: {
              selectedItem: item,
            },
          }),
      }),
      {
        name: "local-first-store",
        storage: idbStorage(),
        partialize: (state) => ({
          showSideBar: state.showSideBar,
          settings: state.settings,
        }),
      },
    ),
    { name: "Store" },
  ),
);

export default useLocalFirstStore;
