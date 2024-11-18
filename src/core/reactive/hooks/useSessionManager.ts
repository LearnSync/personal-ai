import { ChatService } from "@/core/platform/services";
import { IApiConfig } from "@/core/types/apiConfig";
import { EAiProvider } from "@/core/types/enum";
import { useToast } from "@/hooks/use-toast";
import * as React from "react";
import { useApiConfigStore } from "../store/config/apiConfigStore";
import { useActivityExtensionStore } from "../store/sessionManager/activityExtensionManager";
import useChatSessionStore from "../store/sessionManager/chatSessionManager";
import { useSessionManagerStore } from "../store/sessionManager/sessionManagerStore";

interface ISendMessageToLLM {
  messageId: string;
  message: string;
}

export const useSessionManager = () => {
  // ----- Stores
  const apiConfigStore = useApiConfigStore();
  const activityExtensionManager = useActivityExtensionStore();
  const chatSessionManager = useChatSessionStore();
  const sessionManager = useSessionManagerStore();

  // ----- Hooks
  const { toast } = useToast();

  // ----- API Configuration
  const apiConfig: IApiConfig = React.useMemo(
    () => ({
      model: apiConfigStore.model,
      variant: apiConfigStore.variant ?? "",
      localConfigs: apiConfigStore.localConfigs,
      anthropicConfigs: apiConfigStore.anthropicConfigs,
      geminiConfigs: apiConfigStore.geminiConfigs,
      openaiConfigs: apiConfigStore.openaiConfigs,
      ollamaConfigs: apiConfigStore.ollamaConfigs,
    }),
    [apiConfigStore]
  );

  // ----- Chat Service
  const chatService = React.useMemo(
    () => new ChatService(apiConfig),
    [apiConfig]
  );

  // ----- Helper Functions
  const handleError = (error: unknown, title = "Error") => {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    toast({ variant: "destructive", title, description: errorMessage });
    chatSessionManager.setErrorMessage(errorMessage);
  };

  // ----- Actions
  const sendMessageToLLM = async ({
    messageId,
    message,
  }: ISendMessageToLLM): Promise<void> => {
    const chat = chatSessionManager.chat;

    if (!chat) {
      handleError(new Error("Chat session not found."));
      return;
    }

    // Add user message to the chat session
    chatSessionManager.addOrUpdateMessage({
      messageId,
      content: message,
      role: "user",
    });

    if (chat.messages && chat.messages.length > 0) {
      // Automatically start a new session if this is the first message
      if (chat.messages.length === 1) {
        chatSessionManager.startNewChat({
          model: apiConfig.model,
          variant: apiConfig.variant,
        });
      }

      try {
        const { abort } = chatService.sendMessage({
          messages: chat.messages,
          onText: (_, fullText) => {
            chatSessionManager.addOrUpdateMessage({
              messageId,
              content: fullText,
            });
          },
          onFinalMessage: () => {},
          onError: (error) => {
            handleError(error, "Chat Error");
          },
        });

        chatSessionManager.setAbortFunction(abort);
      } catch (error) {
        handleError(error, "Failed to send message");
      }
    }
  };

  const closeAllTabs = () => {
    sessionManager.resetSession();
    activityExtensionManager.getDefaultExtension();
  };

  const onActivityExtensionClick = (extensionId: string) => {
    const extension = activityExtensionManager.extensions.find(
      (ext) => ext.id === extensionId
    );

    if (extension) {
      const isPresent = sessionManager.ifTabAvailableSetActive(extension);
      if (!isPresent && extension.newTab) {
        sessionManager.createTab(extension.label, extension);
      }
      activityExtensionManager.setActiveExtensionTab(extensionId);
    }
  };

  const onTabClose = (tabId: string) => {
    sessionManager.closeTab(tabId);
    if (sessionManager.tabs.size === 1) {
      activityExtensionManager.getDefaultExtension();
    }
  };

  const onTabClick = (tabId: string) => {
    const activeTab = sessionManager.setActiveTab(tabId);
    if (activeTab) {
      activityExtensionManager.setActiveExtensionTabByKey(
        activeTab.extension.identificationKey
      );
    }
  };

  // ----- Effects
  React.useEffect(() => {
    apiConfigStore.setModel(EAiProvider.LOCAL);
    apiConfigStore.setVariant("llama3.2");
  }, [apiConfigStore]);

  return {
    // Chat Actions
    sendMessageToLLM,

    // Tab and Extension Management
    closeAllTabs,
    onActivityExtensionClick,
    onTabClose,
    onTabClick,
  };
};
