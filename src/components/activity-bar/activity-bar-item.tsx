import * as React from "react";
import { Link } from "react-router-dom";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IDefaultExtensionItems } from "@/constants";
import { platform } from "@/core";
import Slugify from "@/core/base/common/slugify";
import { useSessionManager } from "@/core/reactive/hooks/useSessionManager";
import { useActivityExtensionStore } from "@/core/reactive/store/sessionManager/activityExtensionManager";
import { cn } from "@/lib/utils";

interface IActivityBarItemProps extends IDefaultExtensionItems {
  className?: string;
}

export const ActivityBarItem: React.FC<IActivityBarItemProps> = (props) => {
  const { activeExtensionTab, setActiveExtensionTab } =
    useActivityExtensionStore();

  // ----- Store
  const { createNewTab } = useSessionManager();

  return (
    <div
      className={cn(
        "w-full h-fit flex py-4 items-center justify-center border-l-2 border-transparent hover:bg-muted cursor-pointer select-none",
        activeExtensionTab &&
          activeExtensionTab.id === props.id &&
          "border-muted-foreground bg-muted shadow",
        props.className
      )}
      onClick={() => {
        setActiveExtensionTab(props.id);
        if (props.newTab) {
          createNewTab(props.label);
        }
      }}
    >
      <Link
        to={
          Slugify.slugify(props.label) === "chat"
            ? "/"
            : Slugify.slugify(props.label)
        }
      >
        {props.icon && (
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center text-muted-foreground w-7 h-7">
                {props.icon}
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="border select-none border-muted-foreground/40"
            >
              <div className="text-sm font-medium dark:text-gray-400">
                <span>{props.label}</span>
                <span className="ml-1">
                  <span>{"("}</span>
                  {props.shortCut
                    ?.filter((sc) => sc.key === platform)
                    ?.map((sc) => (
                      <span key={sc.key}>{sc.modifiers.join(" + ")}</span>
                    ))}
                </span>
                <span>{")"}</span>
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </Link>
    </div>
  );
};

export default ActivityBarItem;
