import * as React from "react";

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
    shortCut: { key: Platform; modifiers: string[] }[],
    displaySidebar: boolean
  ) => void;
  removeExtension: (id: string) => void;
}

const useActivityExtensionManager = (): UseActivityExtensionManagerResult => {
  const manager = ActivityExtensionManager.getInstance();
  const [extensions, setExtensions] = React.useState<IExtension[]>(
    manager.getExtensions()
  );
  const [activeExtension, setActiveExtension] =
    React.useState<IExtension | null>(manager.getActiveExtensionTab());

  // ----- Effect
  React.useEffect(() => {
    const unsubscribe = manager.subscribe(() => {
      setExtensions(manager.getExtensions());
      setActiveExtension(manager.getActiveExtensionTab());
    });

    return () => {
      unsubscribe();
    };
  }, [manager]);

  const setActiveExtensionTab = (id: string) => {
    manager.setActiveExtensionTab(id);
  };

  const addExtension = (
    label: string,
    icon: React.ReactNode,
    shortCut: { key: Platform; modifiers: string[] }[],
    displaySidebar: boolean
  ) => {
    manager.addExternalExtension(label, icon, shortCut, displaySidebar);
  };

  const removeExtension = (id: string) => {
    manager.removeExtension(id);
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
