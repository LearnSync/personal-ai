import ActivityExtensionManager, {
  IExtension,
} from "@/core/platform/extensions/activityExtensionManager";
import {
  INewSessionResponse,
  SessionManager,
  Tab,
} from "@/core/platform/sessionManager";
import { ILlmMessage } from "@/core/types";
import { IApiConfig } from "@/core/types/appConfig";
import { EAiProvider } from "@/core/types/enum";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import * as React from "react";

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
  isChatLoading: boolean;
  messages: ILlmMessage[];
  startChatSession: (aiProvider: EAiProvider) => INewSessionResponse | null;
  handleChatWithLLM: (value: string, sessionId: string) => void;
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

  const [messages, setMessages] = React.useState<ILlmMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = React.useState<boolean>(false);

  // ----- Hooks
  const { toast } = useToast();

  // ----- React Query
  const chatMutation = useMutation({
    mutationKey: ["chat_with_llm", activeWorkbenchTab?.id],
    mutationFn: async ({
      sessionId,
      value,
    }: {
      sessionId: string;
      value: string;
    }) => {
      setIsChatLoading(true);
      const chatSession = sessionManager.getChatSession(sessionId);

      if (chatSession) {
        setMessages(() => chatSession.messages);
      }

      await sessionManager.sendMessageToLLM({
        tabId: String(sessionId),
        message: value,
        onText: (_, fullText) => {
          setIsChatLoading(false);

          setMessages((prev) => {
            const updatedMessages = [...prev];

            const lastMessage = updatedMessages[updatedMessages.length - 1];

            if (lastMessage && lastMessage.role === "assistant") {
              lastMessage.content = fullText;
            } else {
              updatedMessages.push({
                role: "assistant",
                content: fullText,
              });
            }

            return updatedMessages;
          });
        },
        onFinalMessage: () => {
          const chatHistory = sessionManager.getChatSession(sessionId);

          if (chatHistory) {
            setMessages(() => chatHistory.messages);
          }
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: error,
          });
        },
      });
    },
  });

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

  const handleChatWithLLM = React.useCallback(
    async (value: string, sessionId: string) => {
      await chatMutation.mutateAsync({
        sessionId,
        value,
      });
    },
    []
  );

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

  React.useEffect(() => {
    if (activeWorkbenchTab) {
      const activeChatSession = sessionManager.getChatSession(
        activeWorkbenchTab.id
      );

      if (activeChatSession) {
        setMessages(activeChatSession.messages);
      }
    } else {
      setMessages([]);
    }
  }, [activeWorkbenchTab]);

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
        messages,
        isChatLoading,
        startChatSession,
        handleChatWithLLM,
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
