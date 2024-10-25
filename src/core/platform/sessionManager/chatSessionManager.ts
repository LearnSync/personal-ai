import { EAiProvider } from "@/core/types";

interface ChatSessionData {
  id: string;
  aiProvider: EAiProvider;
  messages: string[];
  isActive: boolean;
}

export class ChatSessionManager {
  private chatSessions: Map<string, ChatSessionData> = new Map();

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
   * @returns {string[]} - The array of messages from the chat session, or undefined if not found.
   */
  public getChatMessages(chatId: string): string[] | undefined {
    return this.chatSessions.get(chatId)?.messages;
  }
}

export default ChatSessionManager;
