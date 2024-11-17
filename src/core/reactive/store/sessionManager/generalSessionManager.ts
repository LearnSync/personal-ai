import { create } from "zustand";
import { IExtension } from "./activityExtensionManager";

export interface IActiveExtension {
  tabId: string | undefined;
  extension: IExtension;
}

interface IGeneralSessionStore {
  // States
  activeExtension: IActiveExtension | null;
  tabExtensionMap: Map<string, IExtension>;

  // Actions
  getSession: (tabId: string) => void;
  setActiveSession: (tabId: string) => void;
  createNewTabSession: (
    tabId: string | undefined,
    extension: IExtension,
  ) => void;
  removeSession: (tabId: string) => void;

  resetSession: () => void;
}

export const useGeneralSessionStore = create<IGeneralSessionStore>()(
  (set, get) => ({
    activeExtension: null,
    tabExtensionMap: new Map(),

    // Getter
    getSession: (tabId: string) => {
      const { tabExtensionMap } = get();
      const session = tabExtensionMap.get(tabId);
      return session || null;
    },

    // Setter
    setActiveSession: (tabId) => {
      set((state) => {
        const extension = state.tabExtensionMap.get(tabId);

        if (extension) {
          return {
            activeExtension: { tabId, extension },
          };
        }

        return {
          activeExtension: null,
        };
      });
    },

    /**
     * Add or update a tab's extension in the map
     */
    createNewTabSession: (tabId, extension) => {
      set((state) => {
        if (tabId) {
          const newMap = new Map(state.tabExtensionMap);
          newMap.set(tabId, extension);

          return {
            tabExtensionMap: newMap,
            activeExtension: { tabId, extension },
          };
        } else {
          return {
            activeExtension: { tabId, extension },
          };
        }
      });
    },

    /**
     * Remove a tab's extension by tabId
     */
    removeSession: (tabId) => {
      set((state) => {
        const newMap = new Map(state.tabExtensionMap);
        newMap.delete(tabId);
        const isActiveTabRemoved = state.activeExtension?.tabId === tabId;

        return {
          tabExtensionMap: newMap,
          activeExtension: isActiveTabRemoved ? null : state.activeExtension,
        };
      });
    },

    /**
     * Reset session
     */
    resetSession: () => {
      set({
        activeExtension: null,
        tabExtensionMap: new Map(),
      });
    },
  }),
);

export default useGeneralSessionStore;
