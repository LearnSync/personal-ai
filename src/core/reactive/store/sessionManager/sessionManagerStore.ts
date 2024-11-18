import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { DEFAULT_EXTENSIONS_ITEMS } from "@/constants";
import { generateUUID } from "@/core/base/common/uuid";
import { storageIndexDb } from "..";
import { IExtension } from "./activityExtensionManager";

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

export interface IActiveTabExtension {
  tab: ITab;
  extension: IExtension;
}

export type TabCloseCallback = (tabId: string) => void;

interface ISessionManagerStore {
  // State
  groups: Map<string, ITabGroup>;
  tabs: Map<string, IActiveTabExtension>;
  tabCloseListeners: TabCloseCallback[];
  activeTab: IActiveTabExtension | null;

  // Tab Actions
  createTab: (label: string, extension?: IExtension) => IActiveTabExtension;
  updateTabLabel: (id: string, label: string) => void;
  lockTab: (id: string) => void;
  unlockTab: (id: string) => void;
  setActiveTab: (id: string) => IActiveTabExtension | undefined;
  closeTab: (id: string) => void;
  closeAllTabs: () => void;
  getTab: (id: string) => IActiveTabExtension | undefined;
  getTabs: () => ITab[];
  ifTabAvailableSetActive: (extension: IExtension) => boolean;

  // Group Actions
  createGroup: (name: string) => ITabGroup;
  addToGroup: (groupId: string, tabId: string) => void;
  toggleGroupOpen: (groupId: string) => void;
  getGroups: () => ITabGroup[];

  // Extension Actions
  getSession: (tabId: string) => IActiveTabExtension | null;
  resetSession: () => void;

  // Tab Close Listener
  onTabClose: (callback: TabCloseCallback) => void;
}

export const useSessionManagerStore = create<ISessionManagerStore>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        groups: new Map<string, ITabGroup>(),
        tabs: new Map<string, IActiveTabExtension>(),
        tabCloseListeners: [],
        activeTab: null,

        // Tab Actions
        createTab: (label, extension = DEFAULT_EXTENSIONS_ITEMS[0]) => {
          const newTab: ITab = {
            id: generateUUID(),
            label,
            isLocked: false,
            createdAt: new Date().toISOString(),
          };
          const tabExtension: IActiveTabExtension = { tab: newTab, extension };
          set((state) => {
            const updatedTabs = new Map(state.tabs);
            updatedTabs.set(newTab.id, tabExtension);
            return { tabs: updatedTabs, activeTab: tabExtension };
          });
          return tabExtension;
        },

        updateTabLabel: (id, label) => {
          set((state) => {
            const tabExtension = state.tabs.get(id);
            if (!tabExtension) return {};
            const updatedTabs = new Map(state.tabs);
            updatedTabs.set(id, {
              ...tabExtension,
              tab: { ...tabExtension.tab, label },
            });
            return { tabs: updatedTabs };
          });
        },

        lockTab: (id) => {
          set((state) => {
            const tabExtension = state.tabs.get(id);
            if (!tabExtension) return {};
            const updatedTabs = new Map(state.tabs);
            updatedTabs.set(id, {
              ...tabExtension,
              tab: { ...tabExtension.tab, isLocked: true },
            });
            return { tabs: updatedTabs };
          });
        },

        unlockTab: (id) => {
          set((state) => {
            const tabExtension = state.tabs.get(id);
            if (!tabExtension) return {};
            const updatedTabs = new Map(state.tabs);
            updatedTabs.set(id, {
              ...tabExtension,
              tab: { ...tabExtension.tab, isLocked: false },
            });
            return { tabs: updatedTabs };
          });
        },

        setActiveTab: (id) => {
          const tabExtension = get().tabs.get(id);
          if (tabExtension) {
            set({ activeTab: tabExtension });
          }
          return tabExtension;
        },

        closeTab: (id) => {
          set((state) => {
            const updatedTabs = new Map(state.tabs);
            updatedTabs.delete(id);

            const isActive = state.activeTab?.tab.id === id;
            const nextActiveTab = isActive
              ? Array.from(updatedTabs.values())[0] || null
              : state.activeTab;

            state.tabCloseListeners.forEach((callback: any) => callback(id));

            return { tabs: updatedTabs, activeTab: nextActiveTab };
          });
        },

        closeAllTabs: () => {
          set({ tabs: new Map(), activeTab: null });
        },
        getTab: (id: string) => {
          const { tabs } = get();
          return tabs.get(id);
        },
        getTabs: () => {
          const { tabs } = get();
          if (!tabs || tabs.size === 0) {
            return [];
          }
          return Array.from(tabs.values()).map((entry) => entry.tab);
        },

        ifTabAvailableSetActive: (extension) => {
          const { activeTab, tabs } = get();
          if (!tabs || tabs.size === 0) {
            return false;
          }

          const tabsArray = Array.from(tabs.values());

          // Check if there is multiple similar tabs
          const similarTabs = tabsArray.filter(
            (tab) =>
              tab.extension.identificationKey === extension.identificationKey
          );

          if (similarTabs.length > 1) {
            set({ activeTab });
            return true;
          } else {
            const tabExtension = tabsArray.find(
              (te) =>
                te.extension.identificationKey === extension.identificationKey
            );

            if (tabExtension) {
              set({ activeTab: tabExtension });
              return true;
            }
          }
          return false;
        },

        // Group Actions
        createGroup: (name) => {
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

        addToGroup: (groupId, tabId) => {
          set((state) => {
            const group = state.groups.get(groupId);
            if (!group) return {};
            const updatedGroups = new Map(state.groups);
            updatedGroups.set(groupId, {
              ...group,
              tabIds: [...group.tabIds, tabId],
            });
            return { groups: updatedGroups };
          });
        },

        toggleGroupOpen: (groupId) => {
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

        // Extension Actions
        getSession: (tabId) => get().tabs.get(tabId) || null,

        resetSession: () => {
          set({ tabs: new Map(), activeTab: null });
        },

        // Tab Close Listener
        onTabClose: (callback) => {
          set((state) => ({
            tabCloseListeners: [...state.tabCloseListeners, callback],
          }));
        },
      }),
      {
        name: "session-manager-store",
        storage: storageIndexDb,
        partialize: (state) => ({
          groups: state.groups,
          tabs: state.tabs,
          activeTab: state.activeTab,
        }),
      }
    ),
    { name: "SessionManagerStore" }
  )
);
