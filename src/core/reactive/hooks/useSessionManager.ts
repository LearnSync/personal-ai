import {
  INewSessionResponse,
  SessionManager,
  SessionManagerOptions,
  Tab,
} from "@/core/platform/sessionManager";
import { EAiProvider } from "@/core/types/enum";
import * as React from "react";

/**
 * Hook to access and manage the singleton instance of `SessionManager`.
 * @param options - Configuration options for initializing the session manager.
 * @returns Session manager instance methods and reactive state data.
 */
export function useSessionManager(options: SessionManagerOptions) {
  // React state to store current tabs and active tab.
  const [tabs, setTabs] = React.useState<Tab[]>([]);
  const [activeTab, setActiveTab] = React.useState<Tab | null>(null);

  // Ensure that the session manager instance is initialized as a singleton.
  const sessionManager = SessionManager.getInstance(options);

  /**
   * Handler to refresh state by retrieving tabs and active tab from the session manager.
   */
  const refreshState = React.useCallback(() => {
    setTabs(sessionManager.getTabs());
    setActiveTab(sessionManager.getActiveTab());
  }, [sessionManager]);

  React.useEffect(() => {
    /**
     * Initial state setup.
     */
    refreshState();

    /**
     * Subscribe to session manager changes.
     */

    const unsubscribe = sessionManager.subscribe(refreshState);

    /**
     * Clean up subscription on component unmount.
     */
    return () => {
      unsubscribe();
    };
  }, [sessionManager, refreshState]);

  /**
   * Start a new chat session, creating a chat and a corresponding tab.
   * @param model - AI provider for the chat.
   * @param variant - Model variant (e.g., "llama3.2") for the chat.
   * @returns New session data, or null on failure.
   */
  const startChatSession = React.useCallback(
    (model: EAiProvider, variant: string): INewSessionResponse | null => {
      const response = sessionManager.startChatSession(model, variant);
      refreshState();
      return response;
    },
    [sessionManager, refreshState]
  );

  /**
   * Set a tab as active by its ID.
   * @param tabId - ID of the tab to set as active.
   */
  const setActiveTabById = React.useCallback(
    (tabId: string) => {
      sessionManager.setActiveTab(tabId);
      refreshState(); // Update state after setting active tab.
    },
    [sessionManager, refreshState]
  );

  /**
   * Close all chat and tab sessions.
   */
  const closeAllSessions = React.useCallback(() => {
    sessionManager.closeAllSessions();
    refreshState(); // Update state after closing all sessions.
  }, [sessionManager, refreshState]);

  /**
   * Send a message to the LLM.
   * @param tabId - ID of the chat's tab.
   * @param message - Message to send.
   * @param onText - Callback for partial text updates.
   * @param onFinalMessage - Callback for the final message.
   * @param onError - Callback for errors.
   */
  const sendMessageToLLM = React.useCallback(
    (
      tabId: string,
      message: string,
      onText: (newText: string, fullText: string) => void,
      onFinalMessage: (fullText: string) => void,
      onError: (error: any) => void
    ) => {
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

  return {
    tabs,
    activeTab,
    startChatSession,
    setActiveTabById,
    closeAllSessions,
    sendMessageToLLM,
  };
}
