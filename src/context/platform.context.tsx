import ActivityExtensionManager, {
  IExtension,
} from "@/core/platform/extensions/activityExtensionManager";
import { ChatSessionManager } from "@/core/platform/sessionManager/chatSessionManager";
import { TabSessionManager } from "@/core/platform/sessionManager/tabSessionManager";
import { EAiProvider } from "@/core/types";
import * as React from "react";

interface IPlatformContextProps {
  tabSessionManager: TabSessionManager;
  chatSessionManager: ChatSessionManager;
  activityExtensionManager: ActivityExtensionManager;

  activeExtensionTab: IExtension;
  activeWorkbenchTab: string | null;

  setActiveTab: (id: string) => void;
  removeTab: (id: string) => void;
  addTab: (label: string) => void;
  startChatInTab: (aiProvider: EAiProvider) => void;
  updateTabLabel: (id: string, label: string) => void;
  setActiveExtensionTab: (id: string) => void;
  removeExtension: (id: string) => void;
}

const PlatformContext = React.createContext<IPlatformContextProps | undefined>(
  undefined
);

export const PlatformProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const tabSessionManager = TabSessionManager.getInstance();
  const chatSessionManager = ChatSessionManager.getInstance();
  const activityExtensionManager = ActivityExtensionManager.getInstance();

  // States
  const [activeExtensionTab, setActiveExtensionTabState] =
    React.useState<IExtension>(
      activityExtensionManager.getActiveExtensionTab()
    );

  const [activeWorkbenchTab, setActiveWorkbenchTab] = React.useState<
    string | null
  >(tabSessionManager.getActiveTabId());

  /**
   * Set the currently active tab
   * @param id - Tab ID to activate
   */
  const setActiveTab = (id: string) => {
    tabSessionManager.setActiveTab(id);
    setActiveWorkbenchTab(id);
  };

  /**
   * Add a new tab and set it as active
   * @param label - Label for the new tab
   */
  const addTab = (label: string) => {
    const newTab = tabSessionManager.createTab(label);
    /**
     * Updating the State for initiating a re-render in the react ui
     */
    setActiveTab(newTab.id);
  };

  /**
   * Remove a tab by its ID
   * @param id - ID of the tab to remove
   */
  const removeTab = (id: string) => {
    tabSessionManager.removeTab(id);
  };

  /**
   * Start a new chat session in a new tab
   * @param aiProvider - AI provider (e.g., OpenAI, Gemini)
   */
  const startChatInTab = (aiProvider: EAiProvider) => {
    chatSessionManager.startNewChat(aiProvider);
    addTab(`Chat with ${aiProvider}`);
  };

  /**
   * Update the label of an existing tab
   * @param id - Tab ID
   * @param label - New label for the tab
   */
  const updateTabLabel = (id: string, label: string) => {
    tabSessionManager.updateTabLabel(id, label);
  };

  /**
   * Set the active extension tab
   * @param id - The id of the extension to set as active
   */
  const setActiveExtensionTab = (id: string) => {
    const extension = activityExtensionManager.setActiveExtensionTab(id);

    /**
     * Updating the State for initiating a re-render in the react ui
     */
    setActiveExtensionTabState(extension);
  };

  /**
   * Remove an extension by its id
   * @param id - The id of the extension to remove
   */
  const removeExtension = (id: string) => {
    activityExtensionManager.removeExtension(id);
  };

  // Side Effect
  React.useEffect(() => {
    const timeId = setTimeout(() => {
      // TODO: Set the Default Active Chat Session
    }, 100);
    return () => clearTimeout(timeId);
  }, []);

  return (
    <PlatformContext.Provider
      value={{
        tabSessionManager,
        chatSessionManager,
        activityExtensionManager,

        removeTab,
        addTab,
        startChatInTab,
        updateTabLabel,
        removeExtension,

        // States
        activeExtensionTab,
        activeWorkbenchTab,
        setActiveTab,
        setActiveExtensionTab,
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
