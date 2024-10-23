import * as React from "react";

import { DEFAULT_EXTENSIONS_ITEMS, IDefaultExtensionItems } from "@/constants";
import { Platform } from "@/core/base/common/platform";
import { generateUUID } from "@/core/base/common/uuid";

export interface IExtension extends IDefaultExtensionItems {}

class ActivityExtensionManager {
  private static instance: ActivityExtensionManager;
  private extensions: IExtension[] = [];

  /**
   * it will store unique id
   */
  private activeExtensionTab: IExtension;

  private constructor() {
    /**
     * Load inbuilt extensions
     */
    this.extensions = [...DEFAULT_EXTENSIONS_ITEMS];

    /**
     * Set default active tab
     */
    this.activeExtensionTab = DEFAULT_EXTENSIONS_ITEMS[0];
  }

  /**
   * Singleton Pattern: Get the instance of the ActivityExtensionManager
   * @returns {ActivityExtensionManager}
   */
  public static getInstance(): ActivityExtensionManager {
    if (!ActivityExtensionManager.instance) {
      ActivityExtensionManager.instance = new ActivityExtensionManager();
    }
    return ActivityExtensionManager.instance;
  }

  /**
   * Set the active extension tab by its id
   * @param id - The id of the extension to set as active
   */
  public setActiveExtensionTab(id: string): IExtension {
    const extension = this.extensions.find((ext) => ext.id === id);
    if (extension) {
      this.activeExtensionTab = extension;
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
   */
  public addExternalExtension(
    label: string,
    icon: React.ReactNode,
    shortCut: { key: Platform; modifiers: string[] }[]
  ): void {
    const newExtension: IExtension = {
      id: generateUUID(),
      label,
      icon,
      shortCut,
    };
    this.extensions.push(newExtension);
  }

  /**
   * Remove an extension by its label
   * @param id - The id of the extension to remove
   */
  public removeExtension(id: string): void {
    this.extensions = this.extensions.filter((ext) => ext.id !== id);
  }

  /**
   * Get all available extensions (inbuilt + external)
   */
  public getExtensions(): IExtension[] {
    return this.extensions;
  }
}

export default ActivityExtensionManager;
