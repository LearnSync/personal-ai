import { PanelLeftClose } from "lucide-react";

import { usePlatformContext } from "@/context/platform.context";
import { cn } from "@/lib/utils";
import { useStore } from "@/store";
import ChatHistorySidebar from "./chat-history-sidebar";
import ContextSearchSidebar from "./context-search-sidebar";
import DefaultSidebar from "./default-sidebar";
import ExtensionsSidebar from "./extensions-sidebar";

export const Sidebar = () => {
  const { showSideBar, setShowSideBar } = useStore();

  // Context
  const { activeExtensionTab, activityExtensionManager } = usePlatformContext();

  const renderSidebarContent = () => {
    switch (activeExtensionTab?.label) {
      case activityExtensionManager.getExtensions()?.[1]?.label:
        return <ContextSearchSidebar />;
      case activityExtensionManager.getExtensions()?.[2]?.label:
        return <ChatHistorySidebar />;
      case activityExtensionManager.getExtensions()?.[3]?.label:
        return <ExtensionsSidebar />;
      default:
        return <DefaultSidebar />;
    }
  };

  return (
    <aside className={cn("relative h-full w-full")}>
      <div className="flex items-center justify-between w-full px-2 border-b">
        <div className="text-sm uppercase font-[500]">
          {activeExtensionTab.label}
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
