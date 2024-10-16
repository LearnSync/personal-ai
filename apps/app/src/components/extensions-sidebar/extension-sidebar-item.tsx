import * as React from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IDefaultExtensionItems } from "@/constants";
import { cn } from "@/lib/utils";
import { useStore } from "@/store";

interface ExtensionSidebarItemProps extends IDefaultExtensionItems {
  className?: string;
}

export const ExtensionSidebarItem: React.FC<ExtensionSidebarItemProps> = (
  props
) => {
  const { activeExtensionTab, setActiveExtensionTab } = useStore();

  return (
    <div
      className={cn(
        "w-full h-fit flex py-4 items-center justify-center border-l-4 border-transparent hover:bg-muted",
        activeExtensionTab === props.label &&
          "border-muted-foreground bg-muted shadow",
        props.className
      )}
      onClick={() => {
        setActiveExtensionTab(props.label);
      }}
    >
      {props.icon && (
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center text-muted-foreground w-7 h-7">
              {props.icon}
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            <div className="text-sm font-medium dark:text-gray-400">
              <span>{props.label}</span>
            </div>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

export default ExtensionSidebarItem;
