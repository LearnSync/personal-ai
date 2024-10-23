import { generateUUID } from "@/core/base/common/uuid";
import { EAiProvider } from "@/core/types";

interface ChatSessionData {
  id: string;
  aiProvider: EAiProvider;
  messages: string[];
  isActive: boolean;
}

export class ChatSessionManager {
  private static instance: ChatSessionManager;
  private chatSessions: Map<string, ChatSessionData> = new Map();

  /**
   * Private constructor to implement Singleton pattern.
   */
  private constructor() {}

  /**
   * Get the singleton instance of ChatSessionManager.
   * Ensures only one instance is used across the app.
   */
  public static getInstance(): ChatSessionManager {
    if (!ChatSessionManager.instance) {
      ChatSessionManager.instance = new ChatSessionManager();
    }
    return ChatSessionManager.instance;
  }

  /**
   * Start a new chat session with a specified AI provider.
   * @param {EAiProvider} aiProvider - The AI provider for the chat (e.g., OpenAI, Gemmini).
   * @returns {string} - The unique ID of the new chat session.
   */
  public startNewChat(aiProvider: EAiProvider): string {
    const chatId = generateUUID();
    const newSession: ChatSessionData = {
      id: chatId,
      aiProvider,
      messages: [],
      isActive: true,
    };
    this.chatSessions.set(chatId, newSession);
    return chatId;
  }

  /**
   * Close a chat session by its unique ID.
   * @param {string} chatId - The unique ID of the chat session to close.
   */
  public closeChat(chatId: string): void {
    const session = this.chatSessions.get(chatId);
    if (session) {
      session.isActive = false;
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
   * Set or update the messages of a chat session.
   * @param {string} chatId - The unique ID of the chat session.
   * @param {string[]} messages - The messages to be updated in the chat session.
   */
  public setChatMessages(chatId: string, messages: string[]): void {
    const session = this.chatSessions.get(chatId);
    if (session) {
      session.messages = messages;
      this.chatSessions.set(chatId, session);
    }
  }

  /**
   * Add a message to an existing chat session.
   * @param {string} chatId - The unique ID of the chat session.
   * @param {string} message - The message to add to the chat.
   */
  public addChatMessage(chatId: string, message: string): void {
    const session = this.chatSessions.get(chatId);
    if (session) {
      session.messages.push(message);
      this.chatSessions.set(chatId, session); // Update session with the new message
    }
  }

  /**
   * Get all messages from a specific chat session.
   * @param {string} chatId - The unique ID of the chat session.
   * @returns {string[]} - The array of messages from the chat session.
   */
  public getChatMessages(chatId: string): string[] | undefined {
    return this.chatSessions.get(chatId)?.messages;
  }

  /**
   * Static method to clear all chat sessions (for resetting or clean-up purposes).
   */
  public static clearAllChatSessions(): void {
    const instance = ChatSessionManager.getInstance();
    instance.chatSessions.clear();
  }
}

export default ChatSessionManager;
