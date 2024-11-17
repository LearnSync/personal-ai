import { useActivityExtensionStore } from "@/core/reactive/store/sessionManager/activityExtensionManager";
import React from "react";
import ActivityBarItem from "./activity-bar-item";

export const ActivityBar: React.FC = () => {
  // ----- Store
  const { extensions } = useActivityExtensionStore();

  return (
    <aside className="flex flex-col items-center justify-between w-full h-screen overflow-hidden border-r border-background-2">
      <div className="w-full">
        {extensions
          ?.filter((item) => item?.position !== "bottom")
          ?.map((item) => (
            <ActivityBarItem key={item.id} {...item} />
          ))}
      </div>

      {/* Only Position Bottom will render here */}
      {extensions
        ?.filter((item) => item?.position === "bottom")
        ?.map((item) => (
          <ActivityBarItem key={item.id} {...item} />
        ))}
    </aside>
  );
};

export default ActivityBar;
