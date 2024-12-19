import { useMutation, useQuery } from "@tanstack/react-query";
import * as React from "react";

import { endpoint } from "@/config/endpoint";
import { generateUUID } from "@/core/base/common/uuid";
import { ILlmMessage } from "@/core/types";
import { useToast } from "@/hooks/use-toast";
import { useChatData } from "@/hooks/useChatData";
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

interface IChatRegistrationPayload {
  session_id: string;
  session_name: string;
  model: string;
  variant: string;
  api_key: string;
  messages: ILlmMessage[];
}

interface ISendLLMMessageParams {
  sessionId: string;
  sessionName: string;
  messages: ILlmMessage[];
  attachments?: { name: string; type: string; data: string }[];
  onText: OnText;
  onFinalMessage: (messageId: string, fullText: string) => void;
  onError: (messageId: string, errorMsg: string) => void;
}

interface IUseChatResponse {
  isLoading: boolean;
  isChatLoading: boolean;
  messages: ILlmMessage[];
  archived: boolean;
  favorite: boolean;
  chatSessionId: string | undefined;
  abort: () => void;
  sendMessage: (params: {
    content: string;
    messageId?: string;
    attachments?: File[];
  }) => void;
  toggleBookmark: () => void;
  toggleArchive: () => void;
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });

export const useChat = (): IUseChatResponse => {
  // --- States
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [messages, setMessages] = React.useState<ILlmMessage[]>([]);
  const [abortController, setAbortController] =
    React.useState<AbortController | null>(null);
  const [archived, setArchived] = React.useState<boolean>(false);
  const [favorite, setFavorite] = React.useState<boolean>(false);

  // --- Hooks
  const { toast } = useToast();
  const { updateMutation } = useChatData();
  const { model, variant, getApiConfigOfActiveVariant } = useApiConfigStore();
  const { activeTab, updateTabLabel } = useSessionManagerStore();

  // --- Query
  const {
    data: chat,
    isLoading: isChatLoading,
    error,
  } = useQuery<IChatResponse>({
    queryKey: ["chat", activeTab?.tab.id],
    queryFn: async () => {
      const response = await fetch(`${endpoint.GET_CHAT}/${activeTab?.tab.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch chat data");
      }
      return response.json();
    },
    enabled: !!activeTab?.tab.id,
    retry: 5,
  });

  // --- Effect
  React.useEffect(() => {
    if (chat) {
      updateTabLabel(chat.session_id, chat.session_name);
      setArchived(chat.archived);
      setFavorite(chat.favorite);
      setMessages(chat.messages || []);
    }
  }, [chat]);

  React.useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    }
  }, [error]);

  // --- Private functions
  const _updateMessageByMessageId = ({
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

  const _sendMessageToLLM = async ({
    sessionId,
    sessionName,
    messages,
    attachments,
    onText,
    onFinalMessage,
    onError,
  }: ISendLLMMessageParams) => {
    const controller = new AbortController();
    setAbortController(controller);
    const responseMessageId = `msg-${generateUUID()}`;
    const apiConfig = getApiConfigOfActiveVariant();

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
          model: apiConfig?.model || model,
          variant: apiConfig?.variant || variant,
          api_key: apiConfig?.apikey,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to read the response body");
      }

      const decoder = new TextDecoder("utf-8");
      let fullText = "";

      // Stream the response
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;

        onText(responseMessageId, fullText);
      }

      onFinalMessage(responseMessageId, fullText);
    } catch (error) {
      onError(
        responseMessageId,
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setAbortController(null);
      setIsLoading(false);
    }
  };

  const _chatRegistrationMutation = useMutation({
    mutationKey: ["chat-registration"],
    mutationFn: async (payload: IChatRegistrationPayload) => {
      const response = await fetch(endpoint.REGISTER_CHAT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Chat registration failed");
      }
      return response.json();
    },
    onError: (error: unknown) => {
      toast({
        variant: "destructive",
        title: "Registration Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    },
  });

  // --- Public functions
  const sendMessage = React.useCallback(
    async ({
      content,
      messageId,
      attachments,
    }: {
      content: string;
      messageId?: string;
      attachments?: File[];
    }) => {
      if (!activeTab) return;

      setIsLoading(true);
      const existingMessageId = messageId || `msg-${generateUUID()}`;
      const newMessage: ILlmMessage = {
        content,
        message_id: existingMessageId,
        role: "user",
      };

      _updateMessageByMessageId({
        messageId: existingMessageId,
        message: newMessage,
      });

      const updatedMessages = messageId ? messages : [...messages, newMessage];
      const base64Attachments = attachments
        ? await Promise.all(attachments.map(fileToBase64))
        : [];

      _sendMessageToLLM({
        sessionId: activeTab.tab.id,
        sessionName: activeTab.tab.label,
        messages: updatedMessages,
        attachments: base64Attachments.map((data, idx) => ({
          name: attachments![idx].name,
          type: attachments![idx].type,
          data,
        })),
        onText: (messageId, fullText) => {
          _updateMessageByMessageId({
            messageId,
            message: {
              message_id: messageId,
              content: fullText,
              role: "assistant",
            },
          });
        },
        onFinalMessage: () => {
          _chatRegistrationMutation.mutateAsync({
            session_id: activeTab.tab.id,
            session_name: activeTab.tab.label,
            messages,
            model,
            variant,
            api_key: getApiConfigOfActiveVariant()?.apikey || "",
          });
        },
        onError: (messageId, errorMsg) => {
          console.error("Error sending message:", errorMsg);
          _updateMessageByMessageId({
            messageId,
            message: {
              message_id: messageId,
              content: errorMsg,
              role: "assistant",
            },
          });
        },
      });
    },
    [messages, activeTab]
  );

  const toggleBookmark = () => {
    if (chat && activeTab && activeTab.tab.id) {
      const session_id = chat
        ? chat.session_id
        : activeTab
        ? activeTab.tab.id
        : undefined;

      if (session_id) {
        updateMutation.mutateAsync({
          session_id,
          payload: {
            favorite: !chat.favorite,
          },
        });
      }
    }
  };

  const toggleArchive = () => {
    if (chat && activeTab && activeTab.tab.id) {
      const session_id = chat
        ? chat.session_id
        : activeTab
        ? activeTab.tab.id
        : undefined;

      if (session_id) {
        updateMutation.mutateAsync({
          session_id,
          payload: {
            archived: !chat.archived,
          },
        });
      }
    }
  };
  _chatRegistrationMutation;
  return {
    archived,
    favorite,
    messages,
    isLoading,
    isChatLoading,
    chatSessionId: chat?.session_id,
    abort: () => abortController?.abort(),
    sendMessage,
    toggleBookmark,
    toggleArchive,
  };
};
