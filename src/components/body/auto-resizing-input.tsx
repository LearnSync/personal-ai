import { Paperclip } from "lucide-react";
import * as React from "react";

import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";

export const AutoResizingInput = () => {
  const [text, setText] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <div
      className={cn(
        "relative flex items-center w-full border-2 shadow-xl h-fit border-muted overflow-y-auto",
        text.length > 100 ? "rounded-3xl" : "rounded-full"
      )}
    >
      <div className="w-8 mx-5">
        <div className={cn(text.length > 200 && "absolute bottom-4 left-0")}>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center justify-center w-full h-12 rounded-l-full">
                <Paperclip className="w-6 h-6 text-muted-foreground" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Attach File</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <ScrollArea
        className={cn("w-full max-h-64", text.length > 200 && "h-64")}
      >
        <Textarea
          ref={textareaRef}
          rows={1}
          value={text}
          placeholder="Message Parsonal AI"
          onChange={handleTextChange}
          className="p-0 py-5 overflow-hidden text-lg leading-relaxed tracking-wider border-none resize-none h-fit focus-visible:outline-none focus-visible:ring-0 placeholder:text-muted-foreground text-primary/80"
        />
      </ScrollArea>

      <div className={cn("mx-5 w-10")}>
        <div
          className={cn(
            "flex items-center justify-center w-10 h-10 p-1 bg-primary rounded-full text-background-1 cursor-pointer hover:bg-primary/80",
            text.length > 200 && "absolute bottom-4 right-4"
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-circle-arrow-up"
          >
            <path d="m16 12-4-4-4 4" />
            <path d="M12 16V8" />
          </svg>
        </div>
      </div>
    </div>
  );
};
