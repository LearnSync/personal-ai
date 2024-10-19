import { cn } from "@/lib/utils";
import SidebarItem from "./sidebar-item";

export const Sidebar = () => {
  return (
    <aside className={cn("w-full p-4")}>
      <SidebarItem />
    </aside>
  );
};

export default Sidebar;
