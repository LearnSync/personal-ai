import { PanelLeftClose } from "lucide-react";

import { useActivityExtensionStore } from "@/core/reactive/store/sessionManager/activityExtensionManager";
import { cn } from "@/lib/utils";
import { useStore } from "@/store";
import ContextSearchSidebar from "./context-search-sidebar";
import DefaultSidebar from "./default-sidebar";
import ExtensionsSidebar from "./extensions-sidebar";
import { ImportantChatSidebar } from "./important-chat-sidebar";

export const Sidebar = () => {
  const { showSideBar, setShowSideBar } = useStore();

  // Context
  const { activeExtensionTab, extensions } = useActivityExtensionStore();
  const renderSidebarContent = () => {
    switch (activeExtensionTab?.label) {
      case extensions?.[1]?.label:
        return <ContextSearchSidebar />;
      case extensions?.[2]?.label:
        return <ImportantChatSidebar />;
      case extensions?.[3]?.label:
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
        <button className="p-2 rounded-md cursor-pointer m ax-w-10 max-h-10 hover:bg-white/10">
          <PanelLeftClose
            className="w-6 h-6 text-muted-foreground"
            onClick={() => setShowSideBar(!showSideBar)}
          />
        </button>
      </div>

      <div>{renderSidebarContent()}</div>
    </aside>
  );
};

export default Sidebar;
