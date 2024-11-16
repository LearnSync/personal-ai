import useGeneralSessionStore, {
  IActiveExtension,
} from "@/core/reactive/store/sessionManager/generalSessionManager";
import { EXTENSION_KEY } from "@/core/types/enum";
import { Chat } from "./chat";
import ImportantChat from "./important-chat/important-chat";
import { Settings } from "./settings";

export const Workbench = () => {
  const { activeExtension } = useGeneralSessionStore();
  console.log("Active Extension: ", activeExtension);

  const getWorkbenchView = (activeExtension: IActiveExtension | null) => {
    if (!activeExtension) return <Chat />;

    const key = activeExtension.extension.key;
    switch (key) {
      case EXTENSION_KEY.IMPORTANT_CHAT:
        return <ImportantChat />;
      case EXTENSION_KEY.SETTINGS:
        return <Settings />;
      default:
        return <Chat />;
    }
  };

  return (
    <main className="flex-1 h-full">{getWorkbenchView(activeExtension)}</main>
  );
};

export default Workbench;
