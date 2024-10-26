import ActivityExtensionManager, {
  IExtension,
} from "@/core/platform/extensions/activityExtensionManager";
import { SessionManager } from "@/core/platform/sessionManager";
import { IApiConfig } from "@/core/types/appConfig";
import { EAiProvider } from "@/core/types/enum";
import * as React from "react";

interface IPlatformContextProps {
  sessionManager: SessionManager;
  activityExtensionManager: ActivityExtensionManager;

  activeExtensionTab: IExtension;
  activeWorkbenchTab: string | null;

  setActiveTab: (id: string) => void;
  setActiveExtensionTab: (id: string) => void;
}

const PlatformContext = React.createContext<IPlatformContextProps | undefined>(
  undefined
);

export const PlatformProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const activityExtensionManager = ActivityExtensionManager.getInstance();

  /**
   * Memoisation in top layer
   */

  const apiConfig: IApiConfig = React.useMemo(() => {
    // TODO: Load the AppConfig from the Database for all the configurations
    return {
      whichApi: EAiProvider.LOCAL,
    };
  }, []);

  const sessionManager = React.useMemo(
    () => new SessionManager({ apiConfig }),
    [apiConfig]
  );

  /**
   * Global States
   */
  const [activeExtensionTab, setActiveExtensionTabState] =
    React.useState<IExtension>(
      activityExtensionManager.getActiveExtensionTab()
    );

  const [activeWorkbenchTab, setActiveWorkbenchTab] = React.useState<
    string | null
  >(sessionManager.getActiveTabId());

  /**
   * Set the currently active tab
   * @param tabId - Tab ID to activate
   */
  const setActiveTab = (tabId: string) => {
    sessionManager.setActiveTabId(tabId);
    setActiveWorkbenchTab(tabId);
  };

  /**
   * Set the active extension tab
   * @param id - The id of the extension to set as active
   */
  const setActiveExtensionTab = (id: string) => {
    const extension = activityExtensionManager.setActiveExtensionTab(id);
    setActiveExtensionTabState(extension);
  };

  // Side Effect
  React.useEffect(() => {
    const timeId = setTimeout(() => {
      // TODO: Set the Default Active Chat Session
    }, 100);
    return () => clearTimeout(timeId);
  }, []);

  return (
    <PlatformContext.Provider
      value={{
        sessionManager,
        activityExtensionManager,

        // States
        activeExtensionTab,
        activeWorkbenchTab,
        setActiveTab,
        setActiveExtensionTab,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatformContext = () => {
  const context = React.useContext(PlatformContext);
  if (!context) {
    throw new Error(
      "usePlatformContext must be used within a PlatformProvider"
    );
  }
  return context;
};
