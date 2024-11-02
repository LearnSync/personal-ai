import { usePlatformContext } from "@/context/platform.context";
import { ILlmMessage } from "@/core/types";
import { useMutation } from "@tanstack/react-query";
import * as React from "react";
import { useToast } from "./use-toast";

interface Chat {
  success: boolean;
  isGenerating: boolean;
  error: string | null;
  isLoading: boolean;
  messages: ILlmMessage[];
  sendMessageToLLM: (value: string, sessionId: string) => void;
  abort: () => void;
}

interface UseChatResponse extends Chat {}

const useChat = (): UseChatResponse => {
  const [messages, setMessages] = React.useState<ILlmMessage[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isGenerating, setIsGenerating] = React.useState<boolean>(false);

  const { sessionManager, activeWorkbenchTab } = usePlatformContext();
  const { toast } = useToast();

  // React Query Mutation for sending chat message
  const chatMutation = useMutation({
    mutationKey: ["chat_with_llm", sessionManager.getActiveTab()],
    mutationFn: async ({
      sessionId,
      value,
    }: {
      sessionId: string;
      value: string;
    }) => {
      setIsLoading(true);
      const chatSession = sessionManager.getChatSession(sessionId);
      if (chatSession) setMessages(chatSession.messages);

      await sessionManager.sendMessageToLLM({
        tabId: sessionId,
        message: value,
        onText: (_, fullText) => {
          setIsLoading(false);
          setSuccess(true);
          setIsGenerating(true);

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
          setIsGenerating(false);

          const chatHistory = sessionManager.getChatSession(sessionId);

          if (chatHistory) {
            setMessages(() => chatHistory.messages);
          }
        },
        onError: (err) => {
          setError(err);
          setIsGenerating(false);

          toast({
            variant: "destructive",
            title: "Error",
            description: err,
          });
        },
      });
    },
  });

  const sendMessageToLLM = React.useCallback(
    async (value: string, sessionId: string) => {
      await chatMutation.mutateAsync({ sessionId, value });
    },
    [chatMutation]
  );

  const abort = async () => {
    const sessionId = activeWorkbenchTab?.id;
    if (sessionId) {
      sessionManager.abortFunction(sessionId);
      setIsGenerating(false);
      setIsLoading(false);
      setSuccess(false);
    }
  };

  // Load chat messages for the active tab
  React.useEffect(() => {
    const loadMessages = () => {
      if (activeWorkbenchTab && sessionManager) {
        const activeChatSession = sessionManager.getChatSession(
          activeWorkbenchTab.id
        );
        setMessages(activeChatSession?.messages || []);
      }
      loadMessages();
    };
  }, [activeWorkbenchTab, sessionManager]);

  return {
    success,
    error,
    isLoading,
    isGenerating,
    messages,
    sendMessageToLLM,
    abort,
  };
};

export default useChat;
