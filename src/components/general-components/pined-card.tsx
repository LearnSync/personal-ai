import { cn } from "@/lib/utils";
import React from "react";

interface PinnedCardProps {
  /**
   * Content to be displayed inside the pinned card.
   */
  children: React.ReactNode;

  /**
   * Additional custom class names for styling.
   */
  className?: string;

  /**
   * Accessible label for the pinned card.
   */
  ariaLabel?: string;
}

const PinnedCard: React.FC<PinnedCardProps> = ({
  children,
  className = "",
  ariaLabel = "Pinned card",
  ...rest
}) => {
  return children ? (
    <div
      className={cn(
        "p-4 px-6 mx-auto w-fit bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 text-background font-medium rounded-xl shadow-lg hover:shadow-xl transform transition-transform hover:scale-105",
        "text-shadow-lg shadow-yellow-500/50 text-background",
        className
      )}
      role="region"
      aria-label={ariaLabel}
      {...rest}
    >
      {children}
    </div>
  ) : null;
};

export default PinnedCard;
