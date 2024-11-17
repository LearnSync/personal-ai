import {
  IActiveTabExtension,
  useSessionManagerStore,
} from "@/core/reactive/store/sessionManager/sessionManagerStore";
import { EXTENSION_KEY } from "@/core/types/enum";
import { Chat } from "./chat";
import ImportantChat from "./important-chat/important-chat";
import { Settings } from "./settings";

export const Workbench = () => {
  const { activeTab } = useSessionManagerStore();

  const getWorkbenchView = (activeExtension: IActiveTabExtension | null) => {
    if (!activeExtension) return <Chat />;

    const identificationKey = activeExtension.extension.identificationKey;
    switch (identificationKey) {
      case EXTENSION_KEY.IMPORTANT_CHAT:
        return <ImportantChat />;
      case EXTENSION_KEY.SETTINGS:
        return <Settings />;
      default:
        return <Chat />;
    }
  };

  return <main className="flex-1 h-full">{getWorkbenchView(activeTab)}</main>;
};

export default Workbench;
