import * as React from "react";

import ActivityExtensionManager, {
  IExtension,
} from "@/core/platform/extensions/activityExtensionManager";
import {
  INewSessionResponse,
  SessionManager,
  Tab,
} from "@/core/platform/sessionManager";
import { IApiConfig } from "@/core/types/appConfig";
import { EAiProvider } from "@/core/types/enum";

interface IPlatformContextProps {
  sessionManager: SessionManager;

  // ----- Extensions
  activityExtensionManager: ActivityExtensionManager;
  activeExtensionTab: IExtension;
  setActiveExtensionTab: (id: string) => void;

  // ----- Workbench Tabs
  activeWorkbenchTab: Tab | null;
  workbenchTabs: Tab[];

  // ----- Tab Sessions
  setActiveTab: (id: string) => void;
  unlockTab: (tabId: string) => void;
  lockTab: (tabId: string) => void;
  removeTab: (tabId: string) => void;

  // ----- Chat Sessions
  startChatSession: (aiProvider: EAiProvider) => INewSessionResponse | null;
}

const PlatformContext = React.createContext<IPlatformContextProps | undefined>(
  undefined
);

export const PlatformProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const activityExtensionManager = ActivityExtensionManager.getInstance();

  /**
   * Memoisation in top layer
   */

  const apiConfig: IApiConfig = React.useMemo(() => {
    // TODO: Load the AppConfig from the Database for all the configurations
    return {
      model: EAiProvider.LOCAL,
      variant: "llama3.2",
    };
  }, []);

  const sessionManager = React.useMemo(
    () => new SessionManager({ apiConfig }),
    [apiConfig]
  );

  /**
   * Global States
   */
  const [activeExtensionTab, setActiveExtensionTabState] =
    React.useState<IExtension>(
      activityExtensionManager.getActiveExtensionTab()
    );

  const [activeWorkbenchTab, setActiveWorkbenchTab] =
    React.useState<Tab | null>(sessionManager.getActiveTab());

  const [workbenchTabs, setWorkbenchTabs] = React.useState<Tab[]>(
    sessionManager.getTabs()
  );

  // ----- Functions ----- //
  // ----- Chat With LLM
  const startChatSession = (
    aiProvider: EAiProvider
  ): INewSessionResponse | null => {
    const newSession = sessionManager.startChatSession(aiProvider);

    if (newSession) {
      const allTabs = sessionManager.getTabs();

      setActiveWorkbenchTab(newSession.tab);
      setWorkbenchTabs(allTabs);
      return newSession;
    }
    return null;
  };

  // ----- Extensions
  const setActiveExtensionTab = (id: string) => {
    const extension = activityExtensionManager.setActiveExtensionTab(id);
    setActiveExtensionTabState(extension);
  };

  // ----- Workbench Tabs
  const unlockTab = (tabId: string) => {
    const tab = sessionManager.unlockTab(tabId);
    const allTabs = sessionManager.getTabs();

    setActiveWorkbenchTab(tab);
    setWorkbenchTabs(allTabs);
  };
  const lockTab = (tabId: string) => {
    const tab = sessionManager.lockTab(tabId);
    const allTabs = sessionManager.getTabs();

    setActiveWorkbenchTab(tab);
    setWorkbenchTabs(allTabs);
  };

  const removeTab = (tabId: string) => {
    // First Storing all the tabs
    let allTabs = sessionManager.getTabs();

    // Checking whether the removed tab is the active one or not
    const activeTab = sessionManager.getActiveTab();

    if (activeTab?.id === tabId) {
      // Now Finding the index
      const currentTabIndex = allTabs.findIndex((tab) => tab.id === tabId);

      // Now Removing the tab
      sessionManager.removeTab(tabId);

      // Again fetching all the tabs
      allTabs = sessionManager.getTabs();

      // Now this will determine which tab will be the active tab after removing the current tab
      if (allTabs.length > 0) {
        if (currentTabIndex > 0 && currentTabIndex < allTabs.length) {
          const justNextTab = allTabs[currentTabIndex - 1];
          setActiveWorkbenchTab(justNextTab);
        } else {
          const firstTab = allTabs[0];
          setActiveWorkbenchTab(firstTab);
        }
      } else {
        setActiveWorkbenchTab(null);
      }
    } else {
      // Just remove the tab form the stack
      sessionManager.removeTab(tabId);
    }

    // Finally fetching all the tabs
    allTabs = sessionManager.getTabs();
    setWorkbenchTabs(allTabs);
  };

  const setActiveTab = (tabId: string) => {
    const activeTab = sessionManager.setActiveTab(tabId);
    const allTabs = sessionManager.getTabs();

    setActiveWorkbenchTab(activeTab);
    setWorkbenchTabs(allTabs);
  };

  return (
    <PlatformContext.Provider
      value={{
        sessionManager,
        activityExtensionManager,

        // ----- Extensions
        activeExtensionTab,

        // ----- Workbench Tabs
        activeWorkbenchTab,
        workbenchTabs,

        // ----- Tab
        lockTab,
        removeTab,
        setActiveTab,
        setActiveExtensionTab,
        unlockTab,

        // ----- Chat
        startChatSession,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatformContext = () => {
  const context = React.useContext(PlatformContext);
  if (!context) {
    throw new Error(
      "usePlatformContext must be used within a PlatformProvider"
    );
  }
  return context;
};
