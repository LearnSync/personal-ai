import { PanelLeftClose } from "lucide-react";

import {
  IExtension,
  useActivityExtensionStore,
} from "@/core/reactive/store/sessionManager/activityExtensionManager";
import { EXTENSION_KEY } from "@/core/types/enum";
import { cn } from "@/lib/utils";
import { useLocalFirstStore } from "@/store";
import ContextSearchSidebar from "./context-search-sidebar";
import DefaultSidebar from "./default-sidebar";
import ExtensionsSidebar from "./extensions-sidebar";
import { ImportantChatSidebar } from "./important-chat-sidebar";

export const Sidebar = () => {
  const { showSideBar, setShowSideBar } = useLocalFirstStore();

  // Context
  const { activeExtensionTab } = useActivityExtensionStore();
  const renderSidebarContent = (activeExtension: IExtension | null) => {
    if (!activeExtension) return <DefaultSidebar />;

    const identificationKey = activeExtension.identificationKey;
    switch (identificationKey) {
      case EXTENSION_KEY.CONTEXT_SEARCH:
        return <ContextSearchSidebar />;
      case EXTENSION_KEY.IMPORTANT_CHAT:
        return <ImportantChatSidebar />;
      case EXTENSION_KEY.EXTENSION:
        return <ExtensionsSidebar />;
      default:
        return <DefaultSidebar />;
    }
  };

  return (
    <aside className={cn("relative h-full w-full")}>
      <div className="flex items-center justify-between w-full px-2 border-b">
        <div className="text-sm uppercase font-[500]">
          {activeExtensionTab?.label}
        </div>
        <button className="p-2 rounded-md cursor-pointer max-w-10 max-h-10 hover:bg-white/10">
          <PanelLeftClose
            className="w-6 h-6 text-muted-foreground"
            onClick={() => setShowSideBar(!showSideBar)}
          />
        </button>
      </div>

      <div>{renderSidebarContent(activeExtensionTab)}</div>
    </aside>
  );
};

export default Sidebar;
