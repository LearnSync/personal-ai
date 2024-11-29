import { ISidebarItem } from "@/core/types/sidebar";
import { cn } from "@/lib/utils";
import { Ellipsis } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface ISidebarItemProps extends ISidebarItem {
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  displayOption?: boolean;
}

export const SidebarItem: React.FC<ISidebarItemProps> = ({
  id,
  label,
  icon,
  options,
  className,
  isActive = false,
  onClick = () => {},
  displayOption = true,
  ...rest
}) => {
  return (
    <Button
      variant={"ghost"}
      className={cn(
        "w-full justify-start h-8 overflow-hidden flex items-center",
        className,
      )}
      key={id}
      onClick={onClick}
      {...rest}
    >
      {icon ?? icon}
      <div
        className={cn(
          "flex items-center justify-start overflow-hidden text-ellipsis whitespace-nowrap",
          displayOption ? "w-full" : "w-[80%]",
        )}
      >
        {label}
      </div>

      {displayOption && (
        <div className="w-[20%] flex justify-end text-muted-foreground">
          <Popover>
            <PopoverTrigger className="flex items-center justify-center">
              <Tooltip>
                <TooltipTrigger>
                  <Ellipsis className="w-6 h-6" />
                </TooltipTrigger>
                <TooltipContent
                  className={cn(
                    "border select-none border-muted-foreground/40",
                  )}
                >
                  Options
                </TooltipContent>
              </Tooltip>
            </PopoverTrigger>
            <PopoverContent
              className={cn(
                "border select-none border-muted-foreground/40 bg-muted max-w-36 p-2 rounded-2xl",
              )}
            >
              {options?.map((opt) => (
                <Button
                  variant={"ghost"}
                  className={cn(
                    "w-full hover:bg-muted-foreground/20 justify-start items-center",
                    opt.className,
                  )}
                  key={opt.id}
                  onClick={opt.action}
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
