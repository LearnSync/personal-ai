import { cn } from "@/lib/utils";
import * as React from "react";

export const MovingBorderDiv = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative inline-flex h-fit overflow-hidden rounded p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50",
        className
      )}
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium text-white rounded cursor-pointer h-fit w-fit bg-background-2 backdrop-blur-3xl">
        {children}
      </span>
    </div>
  );
};

export default MovingBorderDiv;
