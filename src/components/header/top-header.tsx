import { cn } from "@/lib/utils";
import * as React from "react";

interface ITopHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const TopHeader: React.FC<ITopHeaderProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <nav className={cn(className)} {...props}>
      {children}
    </nav>
  );
};

export default TopHeader;
