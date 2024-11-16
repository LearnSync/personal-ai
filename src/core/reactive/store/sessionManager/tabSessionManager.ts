import { create } from "zustand";
import { generateUUID } from "@/core/base/common/uuid";

export interface ITab {
  id: string;
  label: string;
  isLocked: boolean;
}

export type TabCloseCallback = (tabId: string) => void;

interface ITabSessionStore {
  // State
  tabs: Map<string, ITab>;
  activeTab: ITab | null;
  tabCloseListeners: TabCloseCallback[];

  // Actions
  createTab: (label: string) => ITab;
  updateTabLabel: (id: string, label: string) => void;
  setActiveTab: (id: string) => void;
  lockTab: (id: string) => void;
  unlockTab: (id: string) => void;
  removeTab: (id: string) => void;
  getTab: (id: string) => ITab | null;
  getTabs: () => ITab[];
  closeAllTabs: () => void;
  onTabClose: (callback: TabCloseCallback) => void;
}

export const useTabSessionStore = create<ITabSessionStore>((set, get) => ({
  tabs: new Map(),
  activeTab: null,
  tabCloseListeners: [],

  createTab: (label: string) => {
    const newTab: ITab = { id: generateUUID(), label, isLocked: false };
    set((state) => {
      const updatedTabs = new Map(state.tabs);
      updatedTabs.set(newTab.id, newTab);
      return { tabs: updatedTabs };
    });
    return newTab;
  },

  updateTabLabel: (id: string, label: string) => {
    set((state) => {
      const tab = state.tabs.get(id);
      if (tab) {
        const updatedTabs = new Map(state.tabs);
        updatedTabs.set(id, { ...tab, label });
        return { tabs: updatedTabs };
      }
      return {};
    });
  },

  setActiveTab: (id: string) => {
    const tab = get().tabs.get(id);
    if (tab) {
      set({ activeTab: tab });
    }
  },

  lockTab: (id: string) => {
    set((state) => {
      const tab = state.tabs.get(id);
      if (tab) {
        const updatedTabs = new Map(state.tabs);
        updatedTabs.set(id, { ...tab, isLocked: true });
        return { tabs: updatedTabs };
      }
      return {};
    });
  },

  unlockTab: (id: string) => {
    set((state) => {
      const tab = state.tabs.get(id);
      if (tab) {
        const updatedTabs = new Map(state.tabs);
        updatedTabs.set(id, { ...tab, isLocked: false });
        return { tabs: updatedTabs };
      }
      return {};
    });
  },

  removeTab: (id: string) => {
    set((state) => {
      const updatedTabs = new Map(state.tabs);
      updatedTabs.delete(id);
      const isActiveTab = state.activeTab?.id === id;
      return {
        tabs: updatedTabs,
        activeTab: isActiveTab ? null : state.activeTab,
      };
    });
  },

  getTab: (id: string) => {
    return get().tabs.get(id) || null;
  },

  getTabs: () => {
    return Array.from(get().tabs.values());
  },

  closeAllTabs: () => {
    set({ tabs: new Map(), activeTab: null });
  },

  onTabClose: (callback: TabCloseCallback) => {
    set((state) => ({
      tabCloseListeners: [...state.tabCloseListeners, callback],
    }));
  },
}));

export default useTabSessionStore;
