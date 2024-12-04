import { Ellipsis } from "lucide-react";
import * as React from "react";

import { ISidebarItem } from "@/core/types/sidebar";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useSessionManagerStore } from "@/core/reactive/store/sessionManager/sessionManagerStore";
import { useChatData } from "@/hooks/useChatData";

interface ISidebarItemProps extends ISidebarItem {
  icon?: React.ReactNode;
  suffixComponent?: React.ReactNode;
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
  suffixComponent,
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
    <div
      className={cn(
        buttonVariants({
          variant: id === activeTab?.tab.id ? "secondary" : "ghost",
          className: cn(
            "w-full justify-start h-8 overflow-hidden flex items-center cursor-pointer hover:bg-transparent",
            className
          ),
        })
      )}
      key={id}
      onClick={onClick}
      {...rest}
    >
      <div
        className={cn(
          "flex w-full items-center justify-start overflow-hidden text-ellipsis whitespace-nowrap"
        )}
      >
        {icon && <span className="mr-2">{icon}</span>}
        <span>{label}</span>
        {suffixComponent && (
          <span className="ml-auto mr-2">{suffixComponent}</span>
        )}
      </div>

      {displayOption && (
        <div className="max-w-[20%] flex-1 min-w-6 w-6 flex justify-center items-center text-muted-foreground">
          <Popover
            defaultOpen={isOpenPopover}
            open={isOpenPopover}
            onOpenChange={() => setIsOpenPopover((prev) => !prev)}
          >
            <PopoverTrigger className="flex items-center justify-center">
              <Tooltip>
                <TooltipTrigger className="hover:text-white">
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
    </div>
  );
};

export default SidebarItem;
