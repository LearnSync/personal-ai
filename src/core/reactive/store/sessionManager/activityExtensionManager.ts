import { create } from "zustand";
import { devtools } from "zustand/middleware";

import {
  DEFAULT_EXTENSIONS_ITEMS,
  IDefaultExtensionItems,
  IShortCut,
} from "@/constants";
import { generateUUID } from "@/core/base/common/uuid";
import { EXTENSION_KEY } from "@/core/types/enum";

export interface IExtension extends IDefaultExtensionItems {}

interface ActivityExtensionStore {
  // State
  extensions: IExtension[];
  activeExtensionTab: IExtension | null;

  // Actions
  setActiveExtensionTab: (id: string) => void;
  setActiveExtensionTabByKey: (key: string) => void;
  addExternalExtension: (
    label: string,
    key: EXTENSION_KEY,
    shortCut: IShortCut[],
    displaySidebar?: boolean,
    newTab?: boolean,
  ) => void;
  removeExtension: (id: string) => void;
  getDefaultExtension: () => void;
}

export const useActivityExtensionStore = create<ActivityExtensionStore>()(
  devtools(
    (set, get) => ({
      /// ====== States ====== ///
      extensions: [...DEFAULT_EXTENSIONS_ITEMS],
      activeExtensionTab: DEFAULT_EXTENSIONS_ITEMS[0] || null,

      /// ====== Actions ====== ///
      setActiveExtensionTab: (id: string) => {
        const { extensions, activeExtensionTab } = get();
        const extension = extensions.find((ext) => ext.id === id);
        if (extension && extension !== activeExtensionTab) {
          set({ activeExtensionTab: extension });
        }
      },

      setActiveExtensionTabByKey(key: string): void {
        const { extensions, activeExtensionTab } = get();
        const extension = extensions.find(
          (ext) => ext.identificationKey === key,
        );
        if (extension && extension !== activeExtensionTab) {
          set({ activeExtensionTab: extension });
        }
      },

      addExternalExtension: (
        label: string,
        identificationKey: EXTENSION_KEY,
        shortCut: IShortCut[],
        displaySidebar?: boolean,
        newTab?: boolean,
      ) => {
        const { extensions } = get();
        const newExtension: IExtension = {
          id: generateUUID(),
          label,
          identificationKey,
          shortCut,
          displaySidebar,
          newTab,
        };
        set({ extensions: [...extensions, newExtension] });
      },

      removeExtension: (id: string) => {
        const { extensions, activeExtensionTab } = get();
        const filteredExtensions = extensions.filter((ext) => ext.id !== id);
        const newActiveTab =
          activeExtensionTab?.id === id
            ? filteredExtensions[0] || null
            : activeExtensionTab;

        set({
          extensions: filteredExtensions,
          activeExtensionTab: newActiveTab,
        });
      },

      getDefaultExtension: () => {
        set({ activeExtensionTab: DEFAULT_EXTENSIONS_ITEMS[0] });
      },
    }),
    {
      name: "ActivityExtensionStore",
      anonymousActionType: "ActivityExtensionStore",
    },
  ),
);
