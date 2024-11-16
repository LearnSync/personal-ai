import {
  DEFAULT_EXTENSIONS_ITEMS,
  IDefaultExtensionItems,
  IShortCut,
} from "@/constants";
import { generateUUID } from "@/core/base/common/uuid";
import { EXTENSION_KEY } from "@/core/types/enum";
import * as React from "react";
import { create } from "zustand";

export interface IExtension extends IDefaultExtensionItems {}

interface ActivityExtensionStore {
  // State
  extensions: IExtension[];
  activeExtensionTab: IExtension | null;

  // Actions
  setActiveExtensionTab: (id: string) => void;
  addExternalExtension: (
    label: string,
    icon: React.ReactNode,
    key: EXTENSION_KEY,
    shortCut: IShortCut[],
    displaySidebar?: boolean,
    newTab?: boolean
  ) => void;
  removeExtension: (id: string) => void;
  getDefaultExtension: () => void;
}

export const useActivityExtensionStore = create<ActivityExtensionStore>(
  (set, get) => ({
    extensions: [...DEFAULT_EXTENSIONS_ITEMS],
    activeExtensionTab: DEFAULT_EXTENSIONS_ITEMS[0] || null,

    // Actions
    setActiveExtensionTab: (id: string) => {
      const { extensions, activeExtensionTab } = get();
      const extension = extensions.find((ext) => ext.id === id);
      if (extension && extension !== activeExtensionTab) {
        set({ activeExtensionTab: extension });
      }
    },

    addExternalExtension: (
      label: string,
      icon: React.ReactNode,
      key: EXTENSION_KEY,
      shortCut: IShortCut[],
      displaySidebar?: boolean,
      newTab?: boolean
    ) => {
      const { extensions } = get();
      const newExtension: IExtension = {
        id: generateUUID(),
        label,
        icon,
        key,
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

      set({ extensions: filteredExtensions, activeExtensionTab: newActiveTab });
    },
    getDefaultExtension: () => {
      set({ activeExtensionTab: DEFAULT_EXTENSIONS_ITEMS[0] });
    },
  })
);
