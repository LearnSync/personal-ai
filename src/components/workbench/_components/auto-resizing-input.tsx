import { Paperclip, Square } from "lucide-react";
import * as React from "react";

import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface IAutoResizingInputProps {
  value?: string;
  success?: boolean;
  isGenerating?: boolean;
  onEnter?: (value: string) => void;
  onAbort?: () => void;

  className?: string;
  placeholder?: string;
}

export const AutoResizingInput: React.FC<IAutoResizingInputProps> = ({
  value,
  onEnter,
  className,
  isGenerating,
  success,
  placeholder,
  onAbort,
}) => {
  const [text, setText] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        return;
      } else {
        e.preventDefault();
        e.stopPropagation();

        if (onEnter) {
          onEnter(text);
        }
      }
    }
  };

  // ----- Effect
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  React.useEffect(() => {
    if (success) {
      setText("");
    }
  }, [success]);

  return (
    <div
      className={cn(
        "relative flex items-center w-full border-2 shadow-xl border-primary/40",
        text.length > 0
          ? "rounded-3xl overflow-y-auto h-fit"
          : "rounded-full overflow-hidden h-14",
        className
      )}
    >
      <div className={cn("mx-2", text.length > 0 && "mb-2 mt-auto")}>
        <div>
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
        className={cn("max-h-80 h-fit w-full", text.length > 600 && "h-80")}
      >
        <Textarea
          ref={textareaRef}
          rows={1}
          value={value ?? text}
          placeholder={placeholder ?? "Ask LSP AI"}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          className={cn(
            "p-0 py-5 overflow-hidden leading-relaxed tracking-wider border-none resize-none text-md h-fit focus-visible:outline-none focus-visible:ring-0 placeholder:text-muted-foreground text-primary/80"
          )}
        />
      </ScrollArea>

      <div className={cn("mx-3", text.length > 0 && "mb-2 mt-auto")}>
        {isGenerating ? (
          <Button
            size={"icon"}
            className={cn("rounded-full")}
            onClick={onAbort}
          >
            <Square className="fill-background" />
          </Button>
        ) : (
          <Button
            size={"icon"}
            className={cn("rounded-full p-0 [&_svg]:size-7")}
            disabled={text.length === 0}
            onClick={() => {
              if (onEnter) {
                onEnter?.(text);
              } else {
                console.log("Enter pressed, but no onClick handler provided.");
              }
            }}
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
        )}
      </div>
    </div>
  );
};
AutoResizingInput.displayName = "AutoResizingInput";

export default AutoResizingInput;
