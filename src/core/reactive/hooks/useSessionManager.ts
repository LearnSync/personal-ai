import { useActivityExtensionStore } from "../store/sessionManager/activityExtensionManager";
import { useSessionManagerStore } from "../store/sessionManager/sessionManagerStore";

export const useSessionManager = () => {
  // ----- Stores
  const activityExtensionManager = useActivityExtensionStore();
  const sessionManager = useSessionManagerStore();

  // ----- Handlers
  const closeAllTabs = () => {
    sessionManager.resetSession();
    activityExtensionManager.getDefaultExtension();
  };

  const onActivityExtensionClick = (extensionId: string) => {
    const extension = activityExtensionManager.extensions.find(
      (ext) => ext.id === extensionId
    );

    if (extension) {
      const isPresent = sessionManager.ifTabAvailableSetActive(extension);
      if (!isPresent && extension.newTab) {
        sessionManager.createTab(extension.label, extension);
      }
      activityExtensionManager.setActiveExtensionTab(extensionId);
    }
  };

  const onTabClose = (tabId: string) => {
    sessionManager.closeTab(tabId);
    if (sessionManager.tabs.size === 1) {
      activityExtensionManager.getDefaultExtension();
    }
  };

  const onTabClick = (tabId: string) => {
    const activeTab = sessionManager.setActiveTab(tabId);
    if (activeTab) {
      activityExtensionManager.setActiveExtensionTabByKey(
        activeTab.extension.identificationKey
      );
    }
  };

  return {
    closeAllTabs,
    onActivityExtensionClick,
    onTabClose,
    onTabClick,
  };
};
