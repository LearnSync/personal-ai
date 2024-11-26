// import { fetch } from "@tauri-apps/plugin-http";
import * as React from "react";

import { endpoint } from "@/config/endpoint";
import { generateUUID } from "@/core/base/common/uuid";
import { ILlmMessage } from "@/core/types";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useApiConfigStore } from "../store/config/apiConfigStore";
import { useSessionManagerStore } from "../store/sessionManager/sessionManagerStore";

type OnText = (messageId: string, fullText: string) => void;

interface IChatResponse {
  session_id: string;
  session_name: string;
  archived: boolean;
  favorite: boolean;
  created_at: string;
  messages: ILlmMessage[];
}

interface ISendLLMMessageParams {
  sessionId: string;
  sessionName: string;
  messages: ILlmMessage[];
  attachments?: { name: string; type: string; data: string }[];
  onText: OnText;
  onFinalMessage: (messageId: string, fullText: string) => void;
  onError: (error: string) => void;
}

interface IUseChatResponse {
  isLoading: boolean;
  isChatLoading: boolean;
  messages: ILlmMessage[];
  archived: boolean;
  favorite: boolean;

  abort: () => void;
  setChatId: (chatId: string) => void;
  sendMessage: ({
    content,
    messageId,
  }: {
    content: string;
    messageId?: string;
  }) => void;
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });

export const useChat = ({ chatId }: { chatId?: string }): IUseChatResponse => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [messages, setMessages] = React.useState<ILlmMessage[]>([]);
  const [abortController, setAbortController] =
    React.useState<AbortController | null>(null);
  const [currentChatId, setCurrentChatId] = React.useState<string | undefined>(
    chatId
  );
  const [archived, setArchived] = React.useState<boolean>(false);
  const [favorite, setFavorite] = React.useState<boolean>(false);

  // ----- Hooks
  const { toast } = useToast();

  // ----- Store
  const { model, variant } = useApiConfigStore();
  const { activeTab, updateTabLabel } = useSessionManagerStore();

  // ----- React Query
  const {
    data: chat,
    isLoading: isChatLoading,
    error,
  } = useQuery<IChatResponse>({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await fetch(`${endpoint.GET_CHAT}/${chatId}`);
      if (response.status === 200) {
        return await response.json();
      }

      return response.json();
    },
    enabled: chatId ? true : false,
    retry: 5,
    staleTime: Infinity,
  });

  // ----- Effect
  React.useEffect(() => {
    if (chat) {
      // Setting the State and Stores
      setCurrentChatId(chat.session_id);
      updateTabLabel(chat.session_id, chat.session_name);
      setArchived(chat.archived);
      setFavorite(chat.favorite);
      setMessages(() => chat.messages);
    }
  }, [chat]);

  React.useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  }, [error]);

  // ----- Private Function
  const updateMessageByMessageId = (messageId: string, value: string) => {
    setMessages((prev) =>
      prev.map((message) =>
        message.message_id === messageId
          ? { ...message, content: value }
          : message
      )
    );
  };

  const sendMessageToLLM = async ({
    sessionId,
    sessionName,
    messages,
    attachments,
    onText,
    onFinalMessage,
    onError,
  }: ISendLLMMessageParams) => {
    let fullText = "";
    const controller = new AbortController();
    setAbortController(controller);

    const messageIdForAssistant = generateUUID();

    try {
      const formattedAttachments = attachments?.map((file) => ({
        name: file.name,
        type: file.type,
        data: file.data,
      }));

      const response = await fetch(endpoint.CHAT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          session_name: sessionName,
          messages,
          model,
          variant,
          attachments: formattedAttachments,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to get reader from response body");
      }

      const decoder = new TextDecoder("utf-8");

      // Stream the response
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        onText(messageIdForAssistant, fullText);
      }

      onFinalMessage(messageIdForAssistant, fullText);
    } catch (error) {
      console.error("Error:", error);
      if (error instanceof Error) {
        onError(
          error.message || "An error occurred while sending the message."
        );
      }
    } finally {
      setAbortController(null);
      setIsLoading(false);
    }
  };

  // ----- Public Function
  const setChatId = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  const sendMessage = React.useCallback(
    ({
      content,
      messageId,
      attachments,
    }: {
      content: string;
      messageId?: string;
      attachments?: File[];
    }) => {
      if (activeTab) {
        // If there is not current session initiated then initiate the current session
        if (activeTab && activeTab.tab.id && !currentChatId) {
          setCurrentChatId(activeTab.tab.id);
        }

        setIsLoading(true);
        const existingMessageId =
          messageId || `msg-${new Date().toISOString()}`;

        if (messageId) {
          updateMessageByMessageId(existingMessageId, content);
        } else {
          const newMessage: ILlmMessage = {
            message_id: existingMessageId,
            content,
            role: "user",
          };
          setMessages((prev) => [...prev, newMessage]);

          // Convert file attachments to Base64
          const processAttachments = async () => {
            if (!attachments) return [];
            return Promise.all(
              attachments.map(async (file) => {
                const data = await fileToBase64(file);
                return { name: file.name, type: file.type, data };
              })
            );
          };

          processAttachments().then((attachments) => {
            // Callback function
            sendMessageToLLM({
              sessionId: activeTab.tab.id,
              sessionName: activeTab.tab.label,
              messages,
              attachments,
              onText: (messageId, fullText) => {
                updateMessageByMessageId(messageId, fullText);
              },
              onFinalMessage: (messageId, fullText) => {
                updateMessageByMessageId(messageId, fullText);
              },
              onError: (error: string) => {
                toast({
                  variant: "destructive",
                  title: "Error",
                  description: error,
                });
              },
            });
          });
        }
      }
    },
    [messages, activeTab]
  );

  const abort = React.useCallback(() => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
  }, [abortController]);

  return {
    archived,
    favorite,
    messages,
    isLoading,
    isChatLoading,

    // Function
    abort,
    setChatId,
    sendMessage,
  };
};

export default useChat;
