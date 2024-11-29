// import { fetch } from "@tauri-apps/plugin-http";
import * as React from "react";

import { endpoint } from "@/config/endpoint";
import { generateUUID } from "@/core/base/common/uuid";
import { ILlmMessage } from "@/core/types";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useApiConfigStore } from "../store/config/apiConfigStore";
import { useSessionManagerStore } from "../store/sessionManager/sessionManagerStore";
import { sleep } from "@/core/base/common/sleep";

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
  sendMessage: ({
    content,
    messageId,
    attachments,
  }: {
    content: string;
    messageId?: string;
    attachments?: File[];
  }) => void;
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });

export const useChat = (): IUseChatResponse => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [messages, setMessages] = React.useState<ILlmMessage[]>([]);
  const [abortController, setAbortController] =
    React.useState<AbortController | null>(null);
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
    queryKey: ["chat", activeTab?.tab.id],
    queryFn: async () => {
      const response = await fetch(`${endpoint.GET_CHAT}/${activeTab?.tab.id}`);
      if (response.status === 200) {
        return await response.json();
      }

      return response.json();
    },
    enabled: activeTab?.tab.id ? true : false,
    retry: 5,
  });

  // ----- Effect
  React.useEffect(() => {
    if (chat) {
      updateTabLabel(chat.session_id, chat.session_name);
      setArchived(chat.archived);
      setFavorite(chat.favorite);
      setMessages(() => (chat.messages ? chat.messages : []));
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
  const updateMessageByMessageId = ({
    messageId,
    message,
  }: {
    messageId: string;
    message: ILlmMessage;
  }) => {
    setMessages((prev) =>
      prev.some((msg) => msg.message_id === messageId)
        ? // Update the message if it exists
          prev.map((msg) =>
            msg.message_id === messageId
              ? { ...msg, content: message.content }
              : msg
          )
        : // Add the new message if it doesn't exist
          [...prev, message]
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
    const responseMessageId = `msg-${generateUUID()}`;

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
          response_message_id: responseMessageId,
          attachments: formattedAttachments,
          messages,
          model,
          variant,
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
        try {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullText += chunk;
          onText(responseMessageId, fullText);
        } catch (error) {
          console.error("Error decoding: ", error);
        }
      }

      onFinalMessage(responseMessageId, fullText);
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
        setIsLoading(true);
        const existingMessageId = messageId || `msg-${generateUUID()}`;

        if (messageId) {
          updateMessageByMessageId({
            messageId: existingMessageId,
            message: {
              message_id: existingMessageId,
              role: "user",
              content,
            },
          });
        } else {
          const newMessage: ILlmMessage = {
            message_id: existingMessageId,
            content,
            role: "user",
          };

          updateMessageByMessageId({
            messageId: existingMessageId,
            message: newMessage,
          });

          // Sleeping for 100 ms to properly added the message to the State, so the last message must be there in the messages array
          sleep(100);

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
                updateMessageByMessageId({
                  messageId,
                  message: {
                    message_id: messageId,
                    content: fullText,
                    role: "assistant",
                  },
                });
              },
              onFinalMessage: (messageId, fullText) => {
                updateMessageByMessageId({
                  messageId,
                  message: {
                    message_id: messageId,
                    content: fullText,
                    role: "assistant",
                  },
                });
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
    sendMessage,
  };
};

export default useChat;