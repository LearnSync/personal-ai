import { generateUUID } from "@/core/base/common/uuid";

interface Tab {
  id: string;
  label: string;
  isLocked: boolean;
}

export class TabSessionManager {
  private tabs: Map<string, Tab> = new Map();
  private activeTabId: string | null = null;

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
  public setActiveTab(id: string): void {
    if (this.tabs.has(id)) {
      this.activeTabId = id;
    }
  }

  /**
   * Get the active tab ID
   * @returns The active tab's ID
   */
  public getActiveTabId(): string | null {
    return this.activeTabId;
  }

  /**
   * Lock a tab by its ID
   * @param id - The tab ID to lock
   */
  public lockTab(id: string): void {
    const tab = this.tabs.get(id);
    if (tab) {
      this.tabs.set(id, tab);
    }
  }

  /**
   * Unlock a tab by its ID
   * @param id - The tab ID to unlock
   */
  public unlockTab(id: string): void {
    const tab = this.tabs.get(id);
    if (tab) {
      tab.isLocked = false;
      this.tabs.set(id, tab);
    }
  }

  /**
   * Remove a tab by its ID
   * @param id - The tab ID to remove
   */
  public removeTab(id: string): void {
    this.tabs.delete(id);
    if (this.activeTabId === id) {
      this.activeTabId = null; // Clear active tab if it was removed
    }
  }

  /**
   * Get all tabs
   * @returns Array of Tab objects
   */
  public getTabs(): Tab[] {
    return Array.from(this.tabs.values());
  }
}

export default TabSessionManager;
