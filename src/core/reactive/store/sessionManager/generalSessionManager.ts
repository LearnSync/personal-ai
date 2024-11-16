import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IGeneralSessionStore {
  // States
  activeView: string; // E.g., "dashboard", "settings"

  // Actions
  setActiveView: (view: string) => void;

  // Persistence
  resetSession: () => void;
}

export const useGeneralSessionStore = create(
  persist<IGeneralSessionStore>(
    (set) => ({
      activeView: "dashboard",

      // Active View Management
      setActiveView: (view: string) => {
        set({ activeView: view });
      },

      // Reset Session
      resetSession: () => {
        set({
          activeView: "dashboard",
        });
      },
    }),
    {
      name: "general-session-store",
    }
  )
);

export default useGeneralSessionStore;
