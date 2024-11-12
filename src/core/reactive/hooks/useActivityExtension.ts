import * as React from "react";

import { IShortCut } from "@/constants";
import { Platform } from "@/core/base/common/platform";
import {
  ActivityExtensionManager,
  IExtension,
} from "@/core/platform/extensions";

interface UseActivityExtensionManagerResult {
  extensions: IExtension[];
  activeExtension: IExtension | null;
  setActiveExtensionTab: (id: string) => void;
  addExtension: (
    label: string,
    icon: React.ReactNode,
    shortCut: IShortCut[],
    displaySidebar: boolean
  ) => void;
  removeExtension: (id: string) => void;
}

export const useActivityExtensionManager =
  (): UseActivityExtensionManagerResult => {
    const activityExtensionManager = React.useMemo(
      () => ActivityExtensionManager.getInstance(),
      []
    );

    const [extensions, setExtensions] = React.useState<IExtension[]>(
      activityExtensionManager.getExtensions()
    );
    const [activeExtension, setActiveExtension] =
      React.useState<IExtension | null>(
        activityExtensionManager.getActiveExtensionTab()
      );

    // ----- Effect
    React.useEffect(() => {
      const unsubscribe = activityExtensionManager.subscribe(() => {
        setExtensions(activityExtensionManager.getExtensions());
        setActiveExtension(activityExtensionManager.getActiveExtensionTab());
      });

      return () => {
        unsubscribe();
      };
    }, [activityExtensionManager]);

    const setActiveExtensionTab = (id: string) => {
      activityExtensionManager.setActiveExtensionTab(id);
    };

    const addExtension = (
      label: string,
      icon: React.ReactNode,
      shortCut: { key: Platform; modifiers: string[] }[],
      displaySidebar: boolean
    ) => {
      activityExtensionManager.addExternalExtension(
        label,
        icon,
        shortCut,
        displaySidebar
      );
    };

    const removeExtension = (id: string) => {
      activityExtensionManager.removeExtension(id);
    };

    return {
      extensions,
      activeExtension,
      setActiveExtensionTab,
      addExtension,
      removeExtension,
    };
  };

export default useActivityExtensionManager;
