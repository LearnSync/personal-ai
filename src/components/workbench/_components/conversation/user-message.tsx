import { cn } from "@/lib/utils";
import React from "react";

interface UserMessageProps {
  message?: string;
  className?: string;
}

export const UserMessage: React.FC<UserMessageProps> = ({
  message,
  className,
  ...props
}) => {
  if (!message) return null;

  return (
    <div
      className={cn(
        "ml-auto w-fit h-fit max-w-[40rem] bg-[#2f2f2f] p-3 rounded-xl",
        className
      )}
      {...props}
    >
      {message}
    </div>
  );
};

export default UserMessage;
