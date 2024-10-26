/**********************************************
 * This is the EntryPoint to the Session Manager This will manage all the Chat Session, Tab Session,so on..
 * To access other sessions manager you have to pass through this
 ***********************************************/

import { IApiConfig } from "@/core/types/appConfig";
import { EAiProvider } from "@/core/types/enum";
import { ChatService } from "../services";
import ChatSessionManager from "./chatSessionManager";
import TabSessionManager, { Tab } from "./tabSessionManager";
import { ILlmMessage } from "@/core/types/llm";

interface SessionManagerOptions {
  apiConfig: IApiConfig;
}

export class SessionManager {
  private chatSessionManager: ChatSessionManager;
  private tabSessionManager: TabSessionManager;
  private chatService: ChatService;
  private apiConfig: IApiConfig;

  constructor({ apiConfig }: SessionManagerOptions) {
    this.chatSessionManager = ChatSessionManager.getInstance();
    this.tabSessionManager = TabSessionManager.getInstance();
    this.chatService = new ChatService(apiConfig);
    this.apiConfig = apiConfig;

    // Set up listener to close chat sessions when a tab closes
    this.tabSessionManager.onTabClose(this.removeTab.bind(this));
  }

  /**
   * Start a new chat session with a specific AI provider.
   * @param {string} tabId - Unique ID for the tab.
   * @param {EAiProvider} aiProvider - The AI provider for the chat.
   */
  public startChatSession(aiProvider: EAiProvider) {
    const label = `Chat with ${aiProvider}`;
    const tab = this.tabSessionManager.createTab(label);
    this.chatSessionManager.startNewChat(tab.id, aiProvider);
  }

  /**
   * Retrieves the ID of the currently active tab.
   *
   * @returns {string | null} - The ID of the active tab, or `null` if no active tab exists.
   */
  public getActiveTabId(): string | null {
    return this.tabSessionManager.getActiveTabId();
  }

  public setActiveTabId(tabId: string): void {
    this.tabSessionManager.setActiveTab(tabId);
  }

  public createTab(label: string): Tab {
    return this.tabSessionManager.createTab(label);
  }

  public updateTabLabel(tabId: string, label: string): void {
    this.tabSessionManager.updateTabLabel(tabId, label);
  }

  /**
   * Handle closing a tab by closing its associated chat session.
   * @param {string} tabId - Unique ID of the tab to close.
   */
  public removeTab(tabId: string) {
    this.chatSessionManager.closeChat(tabId);
  }

  /**
   * Close all chat and tab sessions.
   */
  public closeAllSessions() {
    this.chatSessionManager.setActiveChatSessions(false);
    this.tabSessionManager.closeAllTabs();
  }

  /**
   * Send a message to the LLM using `ChatService`.
   * @param {string} tabId - Unique ID for the tab/chat.
   * @param {string} message - Message to be sent to the LLM.
   * @param {Function} onText - Callback for text received in real-time.
   * @param {Function} onFinalMessage - Callback when the final response is ready.
   * @param {Function} onError - Callback when an error occurs.
   */
  public async sendMessageToLLM(
    tabId: string,
    messages: ILlmMessage[],
    onText: (newText: string, fullText: string) => void,
    onFinalMessage: (fullText: string) => void,
    onError: (error: any) => void
  ) {
    const chatSession = this.chatSessionManager.getChatSession(tabId);
    if (!chatSession) return;

    const lastMessage = messages[messages.length - 1];

    this.chatSessionManager.addChatMessage(
      tabId,
      lastMessage.content,
      lastMessage.role
    );

    const { abort } = this.chatService.sendMessage({
      messages: chatSession.messages,
      apiConfig: this.apiConfig,
      onText: (newText: string, fullText: string) => {
        onText(newText, fullText);
        this.chatSessionManager.addChatMessage(tabId, fullText);
      },
      onFinalMessage: (fullText: string) => {
        onFinalMessage(fullText);
        this.chatSessionManager.addChatMessage(tabId, fullText);
      },
      onError: (error: any) => {
        console.error("Error in chat:", error);
        onError(error);
        this.chatSessionManager.addChatMessage(
          tabId,
          "An error occurred. Please try again."
        );
      },
    });

    this.chatSessionManager.setAbortFunction(tabId, abort);
  }
}

export default SessionManager;
