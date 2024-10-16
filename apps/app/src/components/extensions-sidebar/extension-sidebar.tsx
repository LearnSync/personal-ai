import { DEFAULT_EXTENSIONS_ITEMS, SETTINGS } from "@/constants";
import React from "react";
import ExtensionSidebarItem from "./extension-sidebar-item";

export const ExtensionSidebar: React.FC = () => {
  return (
    <aside className="flex flex-col items-center justify-between w-full h-screen overflow-hidden">
      <div className="w-full">
        {DEFAULT_EXTENSIONS_ITEMS?.map((item) => (
          <ExtensionSidebarItem key={item.label} {...item} />
        ))}
      </div>

      <ExtensionSidebarItem {...SETTINGS} />
    </aside>
  );
};

export default ExtensionSidebar;
