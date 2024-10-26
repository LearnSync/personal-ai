import { EAiProvider } from "@/core/types/enum";
import { ILlmMessage, IRoleLlm } from "@/core/types/llm";

export interface ChatSessionData {
  id: string;
  aiProvider: EAiProvider;
  messages: ILlmMessage[];
  isActive: boolean;
  abortFunction?: () => void;
}

export class ChatSessionManager {
  private static instance: ChatSessionManager | null = null;
  private chatSessions: Map<string, ChatSessionData> = new Map();

  /**
   * Private constructor to enforce singleton pattern.
   */
  private constructor() {}

  /**
   * Retrieves the singleton instance of ChatSessionManager.
   * If no instance exists, creates a new one.
   * @returns {ChatSessionManager} The singleton instance.
   */
  public static getInstance(): ChatSessionManager {
    if (!ChatSessionManager.instance) {
      ChatSessionManager.instance = new ChatSessionManager();
    }
    return ChatSessionManager.instance;
  }

  /**
   * Start a new chat session with a specified AI provider.
   * @param {string} id - The unique id for Chat.
   * @param {EAiProvider} aiProvider - The AI provider for the chat (e.g., OpenAI, Gemmini).
   * @returns {ChatSessionData} - The new chat session data.
   */
  public startNewChat(id: string, aiProvider: EAiProvider): ChatSessionData {
    const newSession: ChatSessionData = {
      id,
      aiProvider,
      messages: [],
      isActive: true,
    };
    this.chatSessions.set(id, newSession);
    return newSession;
  }

  /**
   * Close a chat session by its unique ID.
   * @param {string} chatId - The unique ID of the chat session to close.
   */
  public closeChat(chatId: string): void {
    const session = this.chatSessions.get(chatId);
    if (session) {
      session.isActive = false;
      session.abortFunction?.();
      this.chatSessions.set(chatId, session);
    }
  }

  /**
   * Get a chat session by its unique ID.
   * @param {string} chatId - The unique ID of the chat session.
   * @returns {ChatSessionData | undefined} - The chat session data, or undefined if not found.
   */
  public getChatSession(chatId: string): ChatSessionData | undefined {
    return this.chatSessions.get(chatId);
  }

  /**
   * Get all active chat sessions.
   * @returns {ChatSessionData[]} - An array of active chat session data.
   */
  public getActiveChatSessions(): ChatSessionData[] {
    return Array.from(this.chatSessions.values()).filter(
      (session) => session.isActive
    );
  }

  /**
   * Set all sessions to active or inactive.
   * @param {boolean} isActive - The desired active status for all chat sessions.
   */
  public setActiveChatSessions(isActive: boolean): void {
    this.chatSessions.forEach((session, chatId) => {
      session.isActive = isActive;
      this.chatSessions.set(chatId, session);
    });
  }

  /**
   * Set or update the messages of a chat session.
   * @param {string} chatId - The unique ID of the chat session.
   * @param {string[]} messages - The messages to be updated in the chat session.
   */
  public setChatMessages(chatId: string, messages: ILlmMessage[]): void {
    const session = this.chatSessions.get(chatId);
    if (session) {
      session.messages = messages;
      this.chatSessions.set(chatId, session);
    }
  }

  /**
   * Add a message to an existing chat session.
   * @param {string} chatId - The unique ID of the chat session.
   * @param {string} content - The content to add to the chat.
   * @param {IRoleLlm} [role] - The role of the message (default is "user").
   */
  public addChatMessage(
    chatId: string,
    content: string,
    role: IRoleLlm = "user"
  ): void {
    const session = this.chatSessions.get(chatId);
    if (session) {
      session.messages.push({ content, role });
      this.chatSessions.set(chatId, session);
    }
  }

  /**
   * Updates the latest message in a specific chat session.
   *
   * @param chatId - The unique ID of the chat session.
   * @param content - The new content for the latest message.
   * @param role - The role of the latest message (default is "user").
   *
   * @returns {void} - This method does not return any value.
   *
   * @throws Will throw an error if the chat session is not found or if there are no messages in the session.
   */
  public updateLatestMessage(
    chatId: string,
    content: string,
    role: IRoleLlm
  ): void {
    const session = this.chatSessions.get(chatId);
    if (session && session.messages.length > 0) {
      session.messages[session.messages.length - 1] = { content, role };
      this.chatSessions.set(chatId, session);
    }
  }

  /**
   * Sets an abort function for a specific chat session.
   * This function allows you to associate an abort function with a chat session, which can be used to stop the chat session gracefully.
   * @param {string} chatId - The unique ID of the chat session to which the abort function will be associated.
   * @param {() => void} abortFunction - A function that will be called to stop the chat session.
   */
  public setAbortFunction(chatId: string, abortFunction: () => void): void {
    const session = this.chatSessions.get(chatId);
    if (session) {
      session.abortFunction = abortFunction;
      this.chatSessions.set(chatId, session);
    }
  }

  /**
   * Get all messages from a specific chat session.
   *
   * This method retrieves all messages from a specific chat session identified by the provided `chatId`.
   *
   * @param {string} chatId - The unique ID of the chat session.
   *
   * @returns {ILlmMessage[] | undefined} - An array of messages from the chat session, or undefined if not found.
   */
  public getChatMessages(chatId: string): ILlmMessage[] | undefined {
    return this.chatSessions.get(chatId)?.messages;
  }
}

export default ChatSessionManager;
