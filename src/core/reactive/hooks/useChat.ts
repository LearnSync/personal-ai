// import { fetch } from "@tauri-apps/plugin-http";
import * as React from "react";

import { endpoint } from "@/config/endpoint";
import { generateUUID } from "@/core/base/common/uuid";
import { ILlmMessage } from "@/core/types";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useApiConfigStore } from "../store/config/apiConfigStore";

type OnText = (messageId: string, fullText: string) => void;

interface ISendLLMMessageParams {
  chatId: string;
  messages: ILlmMessage[];
  attachments?: { name: string; type: string; data: string }[];
  onText: OnText;
  onFinalMessage: (messageId: string, fullText: string) => void;
  onError: (error: string) => void;
}

interface IUseChatResponse {
  isLoading: boolean;
  messages: ILlmMessage[];

  abort: () => void;
  setChatId: (chatId: string) => void;
  sendMessage: ({
    message,
    messageId,
  }: {
    message: string;
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

  // ----- React Query
  const { data: chat, isLoading: existingChatLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      return await fetch(`${endpoint.GET_CHAT}/${chatId}`);
    },
    enabled: chatId ? true : false,
    retry: 5,
    retryOnMount: true,
    staleTime: Infinity,
  });

  console.log("`useChat` | Chat: ", chat, existingChatLoading);

  // ----- Hooks
  const { toast } = useToast();

  // ----- Store
  const { model, variant } = useApiConfigStore();

  // ----- Private Function
  const updateMessageByMessageId = (messageId: string, value: string) => {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === messageId ? { ...message, content: value } : message
      )
    );
  };

  const sendMessageToLLM = async ({
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
      message,
      messageId,
      attachments,
    }: {
      message: string;
      messageId?: string;
      attachments?: File[];
    }) => {
      if (currentChatId) {
        setIsLoading(true);
        const existingMessageId = messageId || generateUUID();

        if (messageId) {
          updateMessageByMessageId(existingMessageId, message);
        } else {
          const newMessage: ILlmMessage = {
            id: existingMessageId,
            message,
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
              chatId: currentChatId,
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
    [messages, currentChatId]
  );

  const abort = React.useCallback(() => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
  }, [abortController]);

  return {
    messages,
    isLoading,
    abort,
    setChatId,
    sendMessage,
  };
};

export default useChat;
