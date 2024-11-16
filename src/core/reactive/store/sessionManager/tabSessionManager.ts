import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateUUID } from "@/core/base/common/uuid";

// Tailwind 500-series color palette
const TAILWIND_COLORS = [
  "#ef4444", // red-500
  "#f59e0b", // amber-500
  "#10b981", // emerald-500
  "#3b82f6", // blue-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "",
];

export interface ITab {
  id: string;
  label: string;
  isLocked: boolean;
  groupId?: string; // Belongs to a group if present
}

export interface ITabGroup {
  id: string;
  name: string;
  color: string;
  isOpen: boolean;
  tabIds: string[]; // Tabs in the group
}

export type TabCloseCallback = (tabId: string) => void;

interface ITabSessionStore {
  // State
  tabs: Map<string, ITab>;
  groups: Map<string, ITabGroup>;
  activeTab: ITab | null;
  tabCloseListeners: TabCloseCallback[];

  // Actions
  createTab: (label: string) => ITab;
  updateTabLabel: (id: string, label: string) => void;
  setActiveTab: (id: string) => void;
  lockTab: (id: string) => void;
  unlockTab: (id: string) => void;
  closeTab: (id: string) => void;
  getTabs: () => ITab[];
  getGroups: () => ITabGroup[];
  closeAllTabs: () => void;

  // Group actions
  createGroup: (name: string) => ITabGroup;
  addToGroup: (groupId: string, tabId: string) => void;
  toggleGroupOpen: (groupId: string) => void;

  // Protected actions
  onTabClose: (callback: TabCloseCallback) => void;
}

export const useTabSessionStore = create(
  persist<ITabSessionStore>(
    (set, get) => ({
      tabs: new Map(),
      groups: new Map(),
      activeTab: null,
      tabCloseListeners: [],

      // Tab Actions
      createTab: (label: string) => {
        const newTab: ITab = { id: generateUUID(), label, isLocked: false };
        set((state) => {
          const updatedTabs = new Map(state.tabs);
          updatedTabs.set(newTab.id, newTab);

          return {
            tabs: updatedTabs,
            activeTab: newTab,
          };
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

      closeTab: (id: string) => {
        set((state) => {
          const updatedTabs = new Map(state.tabs);
          updatedTabs.delete(id);

          const isActiveTab = state.activeTab?.id === id;
          const remainingTabs = Array.from(updatedTabs.values());
          const newActiveTab = isActiveTab
            ? remainingTabs[remainingTabs.length - 1] || null
            : state.activeTab;

          return {
            tabs: updatedTabs,
            activeTab: newActiveTab,
          };
        });
      },

      getTabs: () => Array.from(get().tabs.values()),

      closeAllTabs: () => {
        set({ tabs: new Map(), activeTab: null });
      },

      // Group Actions
      createGroup: (name: string) => {
        const newGroup: ITabGroup = {
          id: generateUUID(),
          name,
          color:
            TAILWIND_COLORS[Math.floor(Math.random() * TAILWIND_COLORS.length)],
          isOpen: true,
          tabIds: [],
        };
        set((state) => {
          const updatedGroups = new Map(state.groups);
          updatedGroups.set(newGroup.id, newGroup);
          return { groups: updatedGroups };
        });
        return newGroup;
      },

      addToGroup: (groupId: string, tabId: string) => {
        set((state) => {
          const group = state.groups.get(groupId);
          if (!group) return {};

          const updatedGroups = new Map(state.groups);
          const updatedTabs = new Map(state.tabs);

          updatedGroups.set(groupId, {
            ...group,
            tabIds: [...group.tabIds, tabId],
          });

          const tab = updatedTabs.get(tabId);
          if (tab) {
            updatedTabs.set(tabId, { ...tab, groupId });
          }

          return { groups: updatedGroups, tabs: updatedTabs };
        });
      },

      toggleGroupOpen: (groupId: string) => {
        set((state) => {
          const group = state.groups.get(groupId);
          if (group) {
            const updatedGroups = new Map(state.groups);
            updatedGroups.set(groupId, { ...group, isOpen: !group.isOpen });
            return { groups: updatedGroups };
          }
          return {};
        });
      },

      getGroups: () => Array.from(get().groups.values()),

      onTabClose: (callback: TabCloseCallback) => {
        set((state) => ({
          tabCloseListeners: [...state.tabCloseListeners, callback],
        }));
      },
    }),
    {
      name: "tab-session-store",
    }
  )
);
