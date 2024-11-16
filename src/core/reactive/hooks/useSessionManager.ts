import * as React from "react";

import { ChatService, ISendLLMMessageParams } from "@/core/platform/services";
import { IApiConfig } from "@/core/types/apiConfig";
import { EAiProvider } from "@/core/types/enum";
import { useApiConfigStore } from "../store/config/apiConfigStore";
import useChatSessionStore, {
  ChatSessionData,
} from "../store/sessionManager/chatSessionManager";
import useTabSessionStore, {
  ITab,
} from "../store/sessionManager/tabSessionManager";

interface INewSessionResponse {
  chat: ChatSessionData;
  tab: ITab;
}

interface ISendMessageToLLM {
  tabId: string;
  message: string;
}

export const useSessionManager = () => {
  // ----- Store
  const tabSessionManager = useTabSessionStore();
  const chatSessionManager = useChatSessionStore();
  const apiConfigStore = useApiConfigStore();

  // ----- Api Config
  const apiConfig: IApiConfig = {
    model: apiConfigStore.model,
    variant: apiConfigStore.variant ?? "",
    localConfigs: apiConfigStore.localConfigs ?? undefined,
    anthropicConfigs: apiConfigStore.anthropicConfigs,
    geminiConfigs: apiConfigStore.geminiConfigs,
    openaiConfigs: apiConfigStore.openaiConfigs,
    ollamaConfigs: apiConfigStore.ollamaConfigs,
  };

  // ----- Chat Service
  const chatService = React.useMemo(() => new ChatService(apiConfig), []);

  // ----- Actions
  function createNewTab(label: string) {
    console.log("Label: ", label);
    tabSessionManager.createTab(label);
  }
  function startChatSession({
    model,
    variant,
  }: {
    model: EAiProvider;
    variant: string;
  }): INewSessionResponse | null {
    const label = `Chat with ${model}`;
    const tab = tabSessionManager.createTab(label);

    if (!tab) return null;
    const chat = chatSessionManager.startNewChat(tab.id, model, variant);

    return { chat, tab };
  }
  function removeSession() {}
  function closeAllSessions() {}

  async function sendMessageToLLM(params: ISendMessageToLLM): Promise<void> {
    const chatSession = chatSessionManager.getChatSession(params.tabId);

    if (!chatSession) throw new Error("Chat session not found.");

    // Adding the last message to the chat session
    chatSessionManager.addOrUpdateChatMessage(
      params.tabId,
      params.message,
      "user"
    );

    const messages = chatSessionManager.getChatMessages(params.tabId);

    if (messages && messages.length > 0) {
      // If First Message then create a new Active Session
      if (messages.length === 1) {
        startChatSession({
          model: apiConfig.model,
          variant: apiConfig.variant,
        });
      }

      const chatServiceParam: ISendLLMMessageParams = {
        messages,
        onText: (_, fullText) => {
          chatSessionManager.addOrUpdateChatMessage(
            params.tabId,
            fullText,
            "assistant"
          );
        },
        onFinalMessage: (fullText) => {
          chatSessionManager.addOrUpdateChatMessage(
            params.tabId,
            fullText,
            "assistant"
          );
        },
        onError: (error) => {
          console.error("Error in chat:", error);
          chatSessionManager.addOrUpdateChatMessage(
            params.tabId,
            "An error occurred.",
            "assistant"
          );
        },
      };

      const { abort } = chatService.sendMessage(chatServiceParam);
      chatSessionManager.setAbortFunction(params.tabId, abort);
    }
  }

  async function abortFunction(sessionId: string) {
    chatSessionManager.abortSession(sessionId);
  }

  // --- Effects
  React.useEffect(() => {
    (async function () {
      apiConfigStore.addConfig("localConfigs", {
        model: "llama",
        variant: "llama3.2",
        apikey: "", // Not Required for Local LLMs
      });
    })();
  }, []);

  return {
    startChatSession,
    removeSession,
    closeAllSessions,
    sendMessageToLLM,
    abortFunction,
    createNewTab,
  };
};
