import { create } from "zustand";

interface Tab {
  id: string;
  label: string;
  isLocked: boolean;
}

interface TabStore {
  tabs: Tab[];
  activeTabId: string | null;
  setActiveTab: (id: string) => void;
  lockTab: (id: string) => void;
  unlockTab: (id: string) => void;
  addTab: (tab: Tab) => void;
  removeTab: (id: string) => void;
}

export const useTabStore = create<TabStore>((set) => ({
  tabs: [],
  activeTabId: null,

  // Set active tab
  setActiveTab: (id: string) =>
    set(() => ({
      activeTabId: id,
    })),

  // Lock a tab
  lockTab: (id: string) =>
    set((state) => ({
      tabs: state.tabs.map((tab) =>
        tab.id === id ? { ...tab, isLocked: true } : tab
      ),
    })),

  // Unlock a tab
  unlockTab: (id: string) =>
    set((state) => ({
      tabs: state.tabs.map((tab) =>
        tab.id === id ? { ...tab, isLocked: false } : tab
      ),
    })),

  // Add a new tab
  addTab: (tab: Tab) =>
    set((state) => ({
      tabs: [...state.tabs, tab],
    })),

  // Remove a tab
  removeTab: (id: string) =>
    set((state) => ({
      tabs: state.tabs.filter((tab) => tab.id !== id),
    })),
}));

export default useTabStore;
