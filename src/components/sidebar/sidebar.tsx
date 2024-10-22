import { PanelLeftClose } from "lucide-react";

import { cn } from "@/lib/utils";
import { useStore } from "@/store";
import SidebarItem from "./sidebar-item";

export const Sidebar = () => {
  const { showSideBar, setShowSideBar } = useStore();

  return (
    <aside className={cn("relative h-full p-4 w-full")}>
      {/* Display Show SideBar toggle button */}
      <div className={cn("absolute z-50 top-2 right-2")}>
        <button className="p-2 py-2 rounded-md cursor-pointer hover:bg-white/10">
          <PanelLeftClose
            className="w-6 h-6 text-muted-foreground"
            onClick={() => setShowSideBar(!showSideBar)}
          />
        </button>
      </div>

      <SidebarItem />
    </aside>
  );
};

export default Sidebar;
