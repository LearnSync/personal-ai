import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { generateUUID } from "@/core/base/common/uuid";

const TAB_COLORS = [
  "#ef4444",
  "#f59e0b",
  "#10b981",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#db2777",
  "#f8fafc",
];

export interface ITab {
  id: string;
  label: string;
  isLocked: boolean;
  groupId?: string;
  createdAt: string;
}

export interface ITabGroup {
  id: string;
  name: string;
  color: string;
  isOpen: boolean;
  tabIds: string[];
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

export const useTabSessionStore = create<ITabSessionStore>()(
  devtools(
    persist(
      (set, get) => ({
        tabs: new Map(),
        groups: new Map(),
        activeTab: null,
        tabCloseListeners: [],

        // Tab Actions
        createTab: (label: string) => {
          const newTab: ITab = {
            id: generateUUID(),
            label,
            isLocked: false,
            createdAt: new Date().toISOString(),
          };
          set(() => {
            let { tabs } = get();

            if (!(tabs instanceof Map)) {
              tabs = new Map(Object.entries(tabs));
            }

            const updatedTabs = new Map(tabs);
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

            // If active tab then we have to remove the active tab to some other tab
            const isActiveTab = state.activeTab?.id === id;
            const remainingTabs = Array.from(updatedTabs.values());
            const sortedTabs = remainingTabs.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            );

            const newActiveTab = isActiveTab
              ? sortedTabs && sortedTabs.length > 0
                ? sortedTabs[0]
                : null
              : state.activeTab;

            return {
              tabs: updatedTabs,
              activeTab: newActiveTab,
            };
          });
        },

        getTabs: () => {
          let { tabs } = get();

          if (!(tabs instanceof Map)) {
            tabs = new Map(Object.entries(tabs));
          }

          return Array.from(tabs.values());
        },

        closeAllTabs: () => {
          set({ tabs: new Map(), activeTab: null });
        },

        // Group Actions
        createGroup: (name: string) => {
          const newGroup: ITabGroup = {
            id: generateUUID(),
            name,
            color: TAB_COLORS[Math.floor(Math.random() * TAB_COLORS.length)],
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
      },
    ),
  ),
);
