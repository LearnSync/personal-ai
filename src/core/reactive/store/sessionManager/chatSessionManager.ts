import { create } from "zustand";
import { EAiProvider } from "@/core/types/enum";
import { ILlmMessage, IRoleLlm } from "@/core/types/llm";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface ChatSessionData {
  model: EAiProvider;
  variant: string;
  messages: ILlmMessage[];
  abortFunction?: () => void;
}

interface IChatSessionStore {
  chat: ChatSessionData | undefined;
  errorMessage: string | null;
  isLoading: boolean;

  // Actions
  startNewChat: ({
    model,
    variant,
  }: {
    model: EAiProvider;
    variant: string;
  }) => void;
  addMessage: (messageId: string, content: string, role?: IRoleLlm) => void;
  updateMessage: (messageId: string, content: string) => void;
  addOrUpdateMessage: ({
    messageId,
    content,
    role,
  }: {
    messageId: string;
    content: string;
    role?: IRoleLlm;
  }) => void;
  setChatMessages: (messages: ILlmMessage[]) => void;
  setErrorMessage: (errorMessage: string | null) => void;
  setAbortFunction: (abortFunction: () => void) => void;
  abort: () => void;
}

export const useChatSessionStore = create<IChatSessionStore>()(
  devtools(
    immer((set, get) => ({
      chat: undefined,
      errorMessage: null,
      isLoading: false,

      // Start a new chat session
      startNewChat: ({ model, variant }) => {
        const newChat: ChatSessionData = {
          model,
          variant,
          messages: [],
        };

        set({ chat: newChat });
      },

      // Add a new message to the chat
      addMessage: (messageId, content, role = "assistant") => {
        set((state) => {
          if (state.chat) {
            state.chat.messages.push({ id: messageId, message: content, role });
          }
        });
      },

      // Update an existing message in the chat
      updateMessage: (messageId, content) => {
        set((state) => {
          if (state.chat) {
            const message = state.chat.messages.find(
              (msg) => msg.id === messageId
            );
            if (message) {
              message.message = content;
            }
          }
        });
      },
      addOrUpdateMessage: ({ messageId, content, role = "assistant" }) => {
        const { chat, addMessage } = get();
        if (chat && chat.messages) {
          const messageIndex = chat.messages.findIndex(
            (msg) => msg.id === messageId
          );
          if (messageIndex > -1) {
            chat.messages[messageIndex].message = content;
          } else {
            addMessage(messageId, content, role);
          }
        }
      },
      // Replace all messages in the chat
      setChatMessages: (messages) => {
        set((state) => {
          if (state.chat) {
            state.chat.messages = messages;
          }
        });
      },

      // Set an error message
      setErrorMessage: (errorMessage) => {
        set({ errorMessage });
      },

      // Set an abort function for the chat
      setAbortFunction: (abortFunction) => {
        set((state) => {
          if (state.chat) {
            state.chat.abortFunction = abortFunction;
          }
        });
      },

      // Abort the current chat session
      abort: () => {
        set((state) => {
          if (state.chat) {
            state.chat.abortFunction?.();
          }
        });
      },
    })),
    { name: "ChatSessionStore", enabled: true }
  )
);

export default useChatSessionStore;
