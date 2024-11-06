import * as React from "react";

import { DEFAULT_EXTENSIONS_ITEMS, IDefaultExtensionItems } from "@/constants";
import { Platform } from "@/core/base/common/platform";
import { generateUUID } from "@/core/base/common/uuid";

export interface IExtension extends IDefaultExtensionItems {}

type Subscriber = () => void;

export class ActivityExtensionManager {
  private static _instance: ActivityExtensionManager;

  private activeExtensionTab: IExtension;
  private extensions: IExtension[] = [];
  private subscribers: Set<Subscriber> = new Set();

  private constructor() {
    /**
     * TODO: This should be done in the platform context Load inbuilt extensions
     */
    this.extensions = [...DEFAULT_EXTENSIONS_ITEMS];

    /**
     * Set default active tab
     */
    this.activeExtensionTab = this.extensions[0];
  }

  /**
   * Singleton Pattern: Get the _instance of the ActivityExtensionManager
   * @returns {ActivityExtensionManager}
   */
  public static getInstance(): ActivityExtensionManager {
    if (!ActivityExtensionManager._instance) {
      ActivityExtensionManager._instance = new ActivityExtensionManager();
    }

    return ActivityExtensionManager._instance;
  }

  /**
   * Notify all subscribers about a change in state.
   */
  private notify(): void {
    this.subscribers.forEach((callback) => callback());
  }

  /**
   * Subscribe to changes in the manager's state.
   * @param callback - Function to be called when state changes
   * @returns Unsubscribe function to remove the listener
   */
  public subscribe(callback: () => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  /**
   * Set the active extension tab by its ID and notify subscribers.
   * @param id - The ID of the extension to set as active
   * @returns The active extension tab
   */
  public setActiveExtensionTab(id: string): IExtension {
    const extension = this.extensions.find((ext) => ext.id === id);
    if (extension && extension !== this.activeExtensionTab) {
      this.activeExtensionTab = extension;
      this.notify();
    }
    return this.activeExtensionTab;
  }

  /**
   * Get the currently active extension tab label
   */
  public getActiveExtensionTab(): IExtension {
    return this.activeExtensionTab;
  }

  /**
   * Add a new external extension dynamically
   * @param label - The label of the new extension
   * @param icon - The icon for the extension
   * @param shortCut - Array of keyboard shortcuts for different platforms
   * @param displaySidebar - Whether to display the extension's sidebar or not
   * @returns {void}  - The added extension is pushed to the extensions array.  The sidebar is updated if the extension has displaySidebar set to true.  The active extension is updated if the extension is the one being added.  The tab is updated if the extension is the one being added and the sidebar is displayed.  The tab is not updated if the extension is not the one being added and the
   */
  public addExternalExtension(
    label: string,
    icon: React.ReactNode,
    shortCut: { key: Platform; modifiers: string[] }[],
    displaySidebar: boolean
  ): void {
    const newExtension: IExtension = {
      id: generateUUID(),
      label,
      icon,
      shortCut,
      displaySidebar,
    };
    this.extensions.push(newExtension);
    this.notify();
  }

  /**
   * Remove an extension by its label
   * @param id - The id of the extension to remove
   */
  public removeExtension(id: string): void {
    this.extensions = this.extensions.filter((ext) => ext.id !== id);

    // --- Adjust activeExtensionTab if the removed extension was active
    if (this.activeExtensionTab.id === id) {
      this.activeExtensionTab = this.extensions[0] || null;
    }

    this.notify();
  }

  /**
   * Get all available extensions (inbuilt + external).
   * @returns Array of all extensions
   */
  public getExtensions(): IExtension[] {
    return this.extensions;
  }
}

export default ActivityExtensionManager;
