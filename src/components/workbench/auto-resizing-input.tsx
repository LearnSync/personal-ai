import { Paperclip } from "lucide-react";
import * as React from "react";

import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

export const AutoResizingInput = React.memo(() => {
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
        "relative flex items-center w-full border-2 shadow-xl border-primary/40",
        text.length > 100
          ? "rounded-3xl overflow-y-auto h-fit"
          : "rounded-full overflow-hidden h-14"
      )}
    >
      <div className="mx-2">
        <div className={cn(text.length > 100 && "absolute bottom-4 left-1")}>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant={"ghost"}
                size={"icon"}
                className={cn("rounded-full [&_svg]:size-5")}
              >
                <Paperclip className="w-6 h-6 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="border border-muted-foreground/40">
              <p>Attach File</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <ScrollArea
        className={cn("w-full max-h-64", text.length > 400 && "h-64")}
      >
        <Textarea
          ref={textareaRef}
          rows={1}
          value={text}
          placeholder="Ask Parsonal AI"
          onChange={handleTextChange}
          className="p-0 py-5 overflow-hidden leading-relaxed tracking-wider border-none resize-none text-md h-fit focus-visible:outline-none focus-visible:ring-0 placeholder:text-muted-foreground text-primary/80"
        />
      </ScrollArea>

      <div className={cn("mx-3")}>
        <Button
          size={"icon"}
          className={cn(
            "rounded-full p-0 [&_svg]:size-7",
            text.length > 100 && "absolute bottom-4 right-4"
          )}
          disabled={text.length === 0}
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
        </Button>
      </div>
    </div>
  );
});
