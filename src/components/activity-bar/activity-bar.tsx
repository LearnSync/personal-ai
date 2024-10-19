import { DEFAULT_EXTENSIONS_ITEMS, SETTINGS } from "@/constants";
import React from "react";
import ActivityBarItem from "./activity-bar-item";

export const ActivityBar: React.FC = () => {
  return (
    <aside className="flex flex-col items-center justify-between w-full h-screen overflow-hidden">
      <div className="w-full">
        {DEFAULT_EXTENSIONS_ITEMS?.map((item) => (
          <ActivityBarItem key={item.label} {...item} />
        ))}
      </div>

      <ActivityBarItem {...SETTINGS} />
    </aside>
  );
};

export default ActivityBar;
