/**********************************************
 * EntryPoint for Session Management.
 * Manages Chat and Tab sessions, ensuring only a single instance (singleton).
 * Provides reactivity via Proxy and Subscription pattern.
 ***********************************************/

import { IApiConfig } from "@/core/types/appConfig";
import { EAiProvider } from "@/core/types/enum";
import { ChatService } from "../services";
import ChatSessionManager, { ChatSessionData } from "./chatSessionManager";
import TabSessionManager, { Tab } from "./tabSessionManager";

export interface SessionManagerOptions {
  apiConfig: IApiConfig;
}

export interface INewSessionResponse {
  chat: ChatSessionData;
  tab: Tab;
}

export class SessionManager {
  private static _instance: SessionManager | null = null;
  private chatSessionManager: ChatSessionManager;
  private tabSessionManager: TabSessionManager;
  private chatService: ChatService;
  private apiConfig: IApiConfig;
  private subscribers: Set<() => void> = new Set();

  private constructor({ apiConfig }: SessionManagerOptions) {
    this.chatSessionManager = ChatSessionManager.getInstance();
    this.tabSessionManager = TabSessionManager.getInstance();
    this.chatService = new ChatService(apiConfig);
    this.apiConfig = apiConfig;

    /**
     * Proxy
     */
    this.chatSessionManager = new Proxy(this.chatSessionManager, {
      set: (target, prop, value) => {
        target[prop as keyof ChatSessionManager] = value;
        this.notify();
        return true;
      },
    });

    this.tabSessionManager = new Proxy(this.tabSessionManager, {
      set: (target, prop, value) => {
        target[prop as keyof TabSessionManager] = value;
        this.notify();
        return true;
      },
    });
  }

  /** Singleton pattern: retrieves or creates the single instance. */
  public static getInstance(options?: SessionManagerOptions): SessionManager {
    if (!SessionManager._instance) {
      if (!options)
        throw new Error(
          "SessionManagerOptions are required on first instantiation."
        );
      SessionManager._instance = new SessionManager(options);
    }
    return SessionManager._instance;
  }

  /** Adds a subscriber to the manager's change notifications. */
  public subscribe(callback: () => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  /** Notifies all subscribers of changes. */
  private notify() {
    this.subscribers.forEach((callback) => callback());
  }

  /**
   * Starts a new chat session, creating both a new chat and a corresponding tab.
   * @param {EAiProvider} model - AI provider for the chat.
   * @param {string} variant - Model variant (e.g., "llama3.2") for the chat.
   * @returns {INewSessionResponse | null} New session data, or null on failure.
   */
  public startChatSession(
    model: EAiProvider,
    variant: string
  ): INewSessionResponse | null {
    const label = `Chat with ${model}`;
    const tab = this.tabSessionManager.createTab(label);
    if (!tab) return null;

    this.setActiveTab(tab.id);
    const chat = this.chatSessionManager.startNewChat(tab.id, model, variant);

    return chat ? { chat, tab } : null;
  }

  // ----- Tab Management ----- //

  /** Retrieves a tab by ID. */
  public getTab(tabId: string): Tab | null {
    return this.tabSessionManager.getTab(tabId);
  }

  /** Returns all tabs. */
  public getTabs(): Tab[] {
    return this.tabSessionManager.getTabs();
  }

  public getActiveTab(): Tab | null {
    return this.tabSessionManager.getActiveTab();
  }

  /**
   * Sets the active tab by its ID.
   *
   * @param {string} tabId - The unique identifier of the tab to be set as active.
   * @returns {Tab | null} - The newly active tab object, or null if the tab does not exist.
   *
   * @remarks
   * This function is responsible for setting the specified tab as the active tab. It calls the `setActiveTab` method of the `tabSessionManager` to set the tab as active and then notifies all subscribers by calling `notify`.
   *
   * @example
   * ```typescript
   * // Set the tab with ID 'tab123' as the active tab
   * const activeTab = sessionManager.setActiveTab('tab123');
   * ```
   */
  public setActiveTab(tabId: string): Tab | null {
    return this.tabSessionManager.setActiveTab(tabId);
  }

  /**
   * Creates a new tab with the specified label.
   *
   * @param {string} label - The label to be assigned to the new tab.
   * @returns {Tab} - The newly created tab object.
   *
   * @remarks
   * This function is responsible for creating a new tab with the specified label. It calls the `createTab` method of the `tabSessionManager` to create a new tab and then notifies all subscribers by calling `notify`.
   *
   * @example
   * ```typescript
   * // Create a new tab with the label "New Tab"
   * const newTab = sessionManager.createTab("New Tab");
   * ```
   */
  public createTab(label: string): Tab {
    const newTab = this.tabSessionManager.createTab(label);
    this.notify();
    return newTab;
  }

  /** Updates a tab's label. */
  public updateTabLabel(tabId: string, label: string): void {
    this.tabSessionManager.updateTabLabel(tabId, label);
    this.notify();
  }

  /** Unlocks a specified tab. */
  public unlockTab(tabId: string): Tab | null {
    return this.tabSessionManager.unlockTab(tabId);
  }

  /** Locks a specified tab. */
  public lockTab(tabId: string): Tab | null {
    return this.tabSessionManager.lockTab(tabId);
  }

  // ----- Chat Session Management -----

  /** Retrieves a chat session by its ID. */
  public getChatSession(id: string): ChatSessionData | undefined {
    return this.chatSessionManager.getChatSession(id);
  }

  /** Removes a tab and its associated chat session. */
  public removeTab(tabId: string) {
    this.chatSessionManager.closeChat(tabId);
    this.tabSessionManager.removeTab(tabId);
    this.notify();
  }

  /** Closes all chat and tab sessions. */
  public closeAllSessions() {
    this.chatSessionManager.setActiveChatSessions(false);
    this.tabSessionManager.closeAllTabs();
    this.notify();
  }

  /**
   * Sends a message to the LLM via `ChatService`.
   * @param {Object} params - Message parameters.
   * @param {string} params.tabId - Tab ID for the chat.
   * @param {string} params.message - Message to be sent.
   * @param {Function} params.onText - Real-time text callback.
   * @param {Function} params.onFinalMessage - Callback on final response.
   * @param {Function} params.onError - Error callback.
   */
  public async sendMessageToLLM({
    tabId,
    message,
    onText,
    onFinalMessage,
    onError,
  }: {
    tabId: string;
    message: string;
    onText: (newText: string, fullText: string) => void;
    onFinalMessage: (fullText: string) => void;
    onError: (error: any) => void;
  }) {
    const chatSession = this.chatSessionManager.getChatSession(tabId);
    if (!chatSession) throw new Error("Chat session not found.");

    this.chatSessionManager.addChatMessage(tabId, message, "user");

    const { abort } = this.chatService.sendMessage({
      messages: chatSession.messages,
      apiConfig: this.apiConfig,
      onText: (newText, fullText) => onText(newText, fullText),
      onFinalMessage: (fullText) => {
        onFinalMessage(fullText);
        this.chatSessionManager.addChatMessage(tabId, fullText, "assistant");
        this.notify();
      },
      onError: (error) => {
        console.error("Error in chat:", error);
        onError(error);
        this.chatSessionManager.addChatMessage(tabId, "An error occurred.");
        this.notify();
      },
    });

    this.chatSessionManager.setAbortFunction(tabId, abort);
  }

  /**
   * Aborts a running LLM session associated with a specific chat tab.
   *
   * @param sessionId - The unique identifier of the chat tab.
   * @returns {void}
   *
   * @remarks
   * This function is responsible for aborting the ongoing LLM session associated with a specific chat tab.
   * It calls the `abortSession` method of the `chatSessionManager` to stop the LLM request and
   * then notifies all subscribers by calling `notify`.
   *
   * @example
   * ```typescript
   * // Abort the LLM session associated with the chat tab with ID 'tab123'
   * sessionManager.abortFunction('tab123');
   * ```
   */
  public abortFunction(sessionId: string): void {
    this.chatSessionManager.abortSession(sessionId);
    this.notify();
  }
}

export default SessionManager;
