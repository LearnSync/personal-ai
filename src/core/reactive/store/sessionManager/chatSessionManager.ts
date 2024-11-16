import { create } from "zustand";
import { EAiProvider } from "@/core/types/enum";
import { ILlmMessage, IRoleLlm } from "@/core/types/llm";

export interface ChatSessionData {
  id: string;
  model: EAiProvider;
  variant: string;
  messages: ILlmMessage[];
  isActive: boolean;
  abortFunction?: () => void;
}

interface IChatSessionStore {
  chatSessions: Map<string, ChatSessionData>;

  // Actions
  startNewChat: (
    id: string,
    model: EAiProvider,
    variant: string
  ) => ChatSessionData;
  closeChat: (chatId: string) => void;
  getChatSession: (chatId: string) => ChatSessionData | undefined;
  getActiveChatSessions: () => ChatSessionData[];
  setActiveChatSessions: (isActive: boolean) => void;
  setChatMessages: (chatId: string, messages: ILlmMessage[]) => void;
  addOrUpdateChatMessage: (
    chatId: string,
    messageId: string,
    message: string,
    role?: IRoleLlm
  ) => void;
  setAbortFunction: (chatId: string, abortFunction: () => void) => void;
  abortSession: (sessionId: string) => void;
  getChatMessages: (chatId: string) => ILlmMessage[] | undefined;
}

const useChatSessionStore = create<IChatSessionStore>((set, get) => ({
  chatSessions: new Map(),

  startNewChat: (id, model, variant) => {
    const newSession: ChatSessionData = {
      id,
      model,
      variant,
      messages: [],
      isActive: true,
    };
    set((state) => {
      const updatedSessions = new Map(state.chatSessions);
      updatedSessions.set(id, newSession);
      return { chatSessions: updatedSessions };
    });
    return newSession;
  },

  closeChat: (chatId) => {
    set((state) => {
      const session = state.chatSessions.get(chatId);
      if (session) {
        session.isActive = false;
        session.abortFunction?.();
        const updatedSessions = new Map(state.chatSessions);
        updatedSessions.set(chatId, session);
        return { chatSessions: updatedSessions };
      }
      return {};
    });
  },

  getChatSession: (chatId) => get().chatSessions.get(chatId),

  getActiveChatSessions: () => {
    return Array.from(get().chatSessions.values()).filter(
      (session) => session.isActive
    );
  },

  setActiveChatSessions: (isActive) => {
    set((state) => {
      const updatedSessions = new Map(state.chatSessions);
      updatedSessions.forEach((session) => (session.isActive = isActive));
      return { chatSessions: updatedSessions };
    });
  },

  setChatMessages: (chatId, messages) => {
    set((state) => {
      const session = state.chatSessions.get(chatId);
      if (session) {
        const updatedSessions = new Map(state.chatSessions);
        session.messages = messages;
        updatedSessions.set(chatId, session);
        return { chatSessions: updatedSessions };
      }
      return {};
    });
  },

  addOrUpdateChatMessage: (chatId, messageId, message, role = "assistant") => {
    set((state) => {
      const session = state.chatSessions.get(chatId);
      if (session) {
        const updatedSessions = new Map(state.chatSessions);
        const messageIndex = session.messages.findIndex(
          (msg) => msg.id === messageId
        );

        if (messageIndex !== -1) {
          session.messages[messageIndex] = { id: messageId, message, role };
        } else {
          session.messages.push({ id: messageId, message, role });
        }

        updatedSessions.set(chatId, session);
        return { chatSessions: updatedSessions };
      }
      return {};
    });
  },

  setAbortFunction: (chatId, abortFunction) => {
    set((state) => {
      const session = state.chatSessions.get(chatId);
      if (session) {
        const updatedSessions = new Map(state.chatSessions);
        session.abortFunction = abortFunction;
        updatedSessions.set(chatId, session);
        return { chatSessions: updatedSessions };
      }
      return {};
    });
  },

  abortSession: (sessionId) => {
    const session = get().chatSessions.get(sessionId);
    session?.abortFunction?.();
  },

  getChatMessages: (chatId) => get().chatSessions.get(chatId)?.messages,
}));

export default useChatSessionStore;
