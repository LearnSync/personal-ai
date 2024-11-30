import { Ellipsis } from "lucide-react";
import * as React from "react";

import { ISidebarItem } from "@/core/types/sidebar";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useSessionManagerStore } from "@/core/reactive/store/sessionManager/sessionManagerStore";
import { useChatData } from "@/hooks/useChatData";

interface ISidebarItemProps extends ISidebarItem {
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  displayOption?: boolean;
}

export const SidebarItem: React.FC<ISidebarItemProps> = ({
  id,
  label,
  chat,
  icon,
  options,
  className,
  isActive = false,
  onClick = () => {},
  displayOption = true,
  ...rest
}) => {
  const [isOpenPopover, setIsOpenPopover] = React.useState(false);

  // ----- Store
  const { activeTab } = useSessionManagerStore();

  // ----- Hooks
  const { updateMutation } = useChatData();

  return (
    <Button
      variant={"ghost"}
      className={cn(
        "w-full justify-start h-8 overflow-hidden flex items-center",
        className
      )}
      key={id}
      onClick={onClick}
      {...rest}
    >
      <div
        className={cn(
          "flex items-center justify-start overflow-hidden text-ellipsis whitespace-nowrap",
          displayOption ? "w-full" : "w-[80%]"
        )}
      >
        {label}
      </div>

      {displayOption && (
        <div className="w-[20%] flex justify-end text-muted-foreground">
          <Popover
            defaultOpen={isOpenPopover}
            open={isOpenPopover}
            onOpenChange={() => setIsOpenPopover((prev) => !prev)}
          >
            <PopoverTrigger className="flex items-center justify-center">
              <Tooltip>
                <TooltipTrigger>
                  <Ellipsis className="w-6 h-6" />
                </TooltipTrigger>
                <TooltipContent
                  className={cn(
                    "border select-none border-muted-foreground/40"
                  )}
                >
                  Options
                </TooltipContent>
              </Tooltip>
            </PopoverTrigger>
            <PopoverContent
              className={cn(
                "border select-none border-muted-foreground/40 bg-muted max-w-36 p-2 rounded-2xl"
              )}
            >
              {options?.map((opt) => (
                <Button
                  variant={"ghost"}
                  className={cn(
                    "w-full hover:bg-muted-foreground/20 justify-start items-center cursor-pointer",
                    opt.className
                  )}
                  key={opt.id}
                  onClick={() => {
                    if (chat) {
                      if (activeTab && activeTab.tab && activeTab.tab.id)
                        updateMutation.mutateAsync({
                          session_id: activeTab.tab.id,
                          payload: {
                            favorite: !chat.favorite,
                          },
                        });
                    }
                    setIsOpenPopover((prev) => !prev);
                  }}
                  asChild
                >
                  <div>
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </div>
                </Button>
              ))}
            </PopoverContent>
          </Popover>
        </div>
      )}
    </Button>
  );
};

export default SidebarItem;
