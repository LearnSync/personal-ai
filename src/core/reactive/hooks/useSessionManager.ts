import {
  INewSessionResponse,
  SessionManager,
  Tab,
} from "@/core/platform/sessionManager";
import { EAiProvider } from "@/core/types/enum";
import * as React from "react";
import { useApiConfigStore } from "../store/apiConfigStore";

export function useSessionManager() {
  const [tabs, setTabs] = React.useState<Tab[]>([]);
  const [activeTab, setActiveTab] = React.useState<Tab | null>(null);

  // ----- Hooks
  const apiConfig = useApiConfigStore();

  const sessionManager = React.useMemo(
    () => SessionManager.getInstance({ apiConfig }),
    []
  );

  const refreshState = React.useCallback(() => {
    setTabs(sessionManager.getTabs());
    setActiveTab(sessionManager.getActiveTab());
  }, [sessionManager]);

  // ----- Effect
  React.useEffect(() => {
    refreshState();

    const unsubscribe = sessionManager.subscribe(refreshState);

    return () => {
      unsubscribe();
    };
  }, [sessionManager, refreshState]);

  const startChatSession = React.useCallback(
    (model: EAiProvider, variant: string): INewSessionResponse | null => {
      const response = sessionManager.startChatSession(model, variant);
      refreshState();
      return response;
    },
    [sessionManager, refreshState]
  );

  const getChatSessionById = React.useCallback(
    (tabId: string) => {
      return sessionManager.getChatSession(tabId);
    },
    [sessionManager]
  );

  const setActiveTabById = React.useCallback(
    (tabId: string) => {
      sessionManager.setActiveTab(tabId);
      refreshState();
    },
    [sessionManager, refreshState]
  );

  const closeAllSessions = React.useCallback(() => {
    sessionManager.closeAllSessions();
    refreshState();
  }, [sessionManager, refreshState]);

  const sendMessageToLLM = React.useCallback(
    ({
      tabId,
      message,
      onText,
      onFinalMessage,
      onError,
    }: {
      tabId: string;
      message: string;
      onText: (newText: string, fullText: string) => void;
      onFinalMessage: (fullText: string) => void;
      onError: (error: any) => void;
    }) => {
      sessionManager.sendMessageToLLM({
        tabId,
        message,
        onText,
        onFinalMessage,
        onError,
      });
    },
    [sessionManager]
  );

  const abortFunction = React.useCallback(
    (sessionId: string) => {
      return sessionManager.abortFunction(sessionId);
    },
    [sessionManager]
  );

  return {
    tabs,
    activeTab,

    // ----- Functions
    abortFunction,
    closeAllSessions,
    getChatSessionById,
    startChatSession,
    setActiveTabById,
    sendMessageToLLM,
  };
}
