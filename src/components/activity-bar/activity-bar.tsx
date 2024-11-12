import { usePlatformContext } from "@/context/platform.context";
import React from "react";
import ActivityBarItem from "./activity-bar-item";

export const ActivityBar: React.FC = () => {
  // ----- Context
  const { activityExtensionManager } = usePlatformContext();

  return (
    <aside className="flex flex-col items-center justify-between w-full h-screen overflow-hidden border-r border-background-2">
      <div className="w-full">
        {activityExtensionManager?.extensions
          ?.filter((item) => item?.position !== "bottom")
          ?.map((item) => (
            <ActivityBarItem key={item.label} {...item} />
          ))}
      </div>

      {/* Only Position Bottom will render here */}
      {activityExtensionManager.extensions
        ?.filter((item) => item?.position === "bottom")
        ?.map((item) => (
          <ActivityBarItem key={item.label} {...item} />
        ))}
    </aside>
  );
};

export default ActivityBar;
