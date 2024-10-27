import { generateUUID } from "@/core/base/common/uuid";

export interface Tab {
  id: string;
  label: string;
  isLocked: boolean;
}
export type TabCloseCallback = (tabId: string) => void;

export class TabSessionManager {
  private tabs: Map<string, Tab> = new Map();
  private activeTabId: string | null = null;
  private tabCloseListeners: TabCloseCallback[] = [];

  /**
   * Private constructor to implement Singleton pattern.
   */
  private constructor() {}

  /**
   * Get the singleton instance of TabSessionManager.
   */
  public static getInstance(): TabSessionManager {
    const newSessionManager = new TabSessionManager();
    return newSessionManager;
  }

  /**
   * Register a listener for tab close events.
   * @param callback - Function to call when a tab is closed.
   */
  public onTabClose(callback: TabCloseCallback): void {
    this.tabCloseListeners.push(callback);
  }

  /**
   * Create a new tab session
   * @param label - The label for the new tab
   * @returns The new Tab object
   */
  public createTab(label: string): Tab {
    const newTab: Tab = {
      id: generateUUID(),
      label,
      isLocked: false,
    };
    this.tabs.set(newTab.id, newTab);
    return newTab;
  }

  /**
   * Update the label of a tab by its ID.
   *
   * @param id - The ID of the tab to update.
   * @param label - The new label for the tab.
   *
   * @returns {void}
   *
   * @throws Will throw an error if the tab with the given ID does not exist.
   */
  public updateTabLabel(id: string, label: string): void {
    const tab = this.tabs.get(id);
    if (tab) {
      tab.label = label;
      this.tabs.set(id, tab);
    }
  }

  /**
   * Set a tab as active by its ID
   * @param id - The tab ID to set as active
   */
  public setActiveTab(id: string): Tab | null {
    if (this.tabs.has(id)) {
      this.activeTabId = id;
      return this.getTab(id)!;
    }
    return null;
  }

  /**
   * Get the active tab ID
   * @returns The active tab's ID
   */
  public getActiveTab(): Tab | null {
    const activeTabId = this.activeTabId;
    if (activeTabId) {
      return this.getTab(activeTabId);
    }

    return null;
  }

  /**
   * Lock a tab by its ID
   * @param id - The tab ID to lock
   */
  public lockTab(id: string): Tab | null {
    const tab = this.tabs.get(id);
    if (tab) {
      tab.isLocked = true;
      this.tabs.set(id, tab);
      return tab;
    }
    return null;
  }

  /**
   * Unlock a tab by its ID
   * @param id - The tab ID to unlock
   */
  public unlockTab(id: string): Tab | null {
    const tab = this.tabs.get(id);
    if (tab) {
      tab.isLocked = false;
      this.tabs.set(id, tab);
      return tab;
    }
    return null;
  }

  /**
   * Remove a tab by its ID
   * @param id - The tab ID to remove
   */
  public removeTab(id: string): void {
    this.tabs.delete(id);
    if (this.activeTabId === id) {
      this.activeTabId = null;
    }
  }

  public getTab(id: string): Tab | null {
    const tab = this.tabs.get(id);
    if (tab) return tab;
    return null;
  }

  /**
   * Get all tabs
   * @returns Array of Tab objects
   */
  public getTabs(): Tab[] {
    return Array.from(this.tabs.values());
  }

  /**
   * Close all open tabs.
   */
  public closeAllTabs(): void {
    this.tabs.clear(); // Clears all tabs from the Map
    this.activeTabId = null; // Resets the active tab
  }
}

export default TabSessionManager;
