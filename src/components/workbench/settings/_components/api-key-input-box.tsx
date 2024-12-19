import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApiConfigStore } from "@/core/reactive/store/config/apiConfigStore";
import { EAiProvider } from "@/core/types/enum";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Check, Eye, EyeOff, Trash2, Zap } from "lucide-react";
import * as React from "react";

interface ApiKeyInputBoxProps {
  keyForElement: EAiProvider;
  idx: number;

  className?: string;
  variants: string[];
  apiKey?: string;
}

export const ApiKeyInputBox: React.FC<ApiKeyInputBoxProps> = ({
  idx,
  className,
  keyForElement,
  variants,
  apiKey,
  ...props
}) => {
  const [currentApiKey, setCurrentApiKey] = React.useState(apiKey ?? "");
  const [variant, setVariant] = React.useState(variants?.[0] ?? "");
  const [showKey, setShowKey] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(apiKey ? true : false);

  // --- Store
  const { updateConfig, deleteConfig, getConfig } = useApiConfigStore();

  // --- Hooks
  const { toast } = useToast();

  // --- Effects
  React.useEffect(() => {
    if (currentApiKey && variant) {
      const currentConfig = getConfig(keyForElement);
      if (currentConfig[idx].apikey !== currentApiKey) {
        setIsSaved(false);
      }
    }
  }, [currentApiKey]);

  return (
    <div className="" {...props}>
      <div className="flex items-center space-x-5">
        <Input
          type={currentApiKey && showKey ? "text" : "password"}
          className={cn("border border-primary", className)}
          value={currentApiKey}
          onChange={(e) => {
            const value = e.target.value;
            setCurrentApiKey(value);
          }}
        />

        {/* Model Variant */}
        <Select
          defaultValue={variant}
          onValueChange={(value) => {
            setVariant(value);
          }}
        >
          <SelectTrigger className="w-40 bg-background-2">
            <SelectValue placeholder="Variant" />
          </SelectTrigger>

          <SelectContent className="bg-background-2">
            {variants?.map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center space-x-3">
          {currentApiKey && (
            <Button
              size={"icon"}
              variant={"secondary"}
              onClick={() => setShowKey((prev) => !prev)}
            >
              {showKey ? <EyeOff /> : <Eye />}
            </Button>
          )}

          <Button
            variant={"destructive"}
            size={"icon"}
            onClick={(e) => {
              e.stopPropagation();
              deleteConfig(keyForElement, idx);
            }}
          >
            <Trash2 />
          </Button>

          {currentApiKey && (
            <Button
              size={"sm"}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                if (!variant) {
                  toast({
                    variant: "destructive",
                    title: "Missing Variant",
                    description: "Please select a variant for the API key",
                  });
                }

                if (keyForElement) {
                  updateConfig({
                    type: keyForElement,
                    index: idx,
                    apikey: currentApiKey,
                    variant,
                  });

                  setIsSaved(true);
                }
              }}
            >
              Save
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-x-2">
        {keyForElement && (
          <p className="mt-2 text-xs text-muted-foreground">
            (Your {keyForElement} API Key)
          </p>
        )}
        {isSaved ? (
          <p className="flex items-center gap-1 mt-2 text-xs text-success">
            <Check className="w-4 h-4" />
            <span>Saved</span>
          </p>
        ) : (
          <p className="flex items-center gap-1 mt-2 text-xs">
            <Zap className="w-5 h-5 text-destructive fill-destructive" />
          </p>
        )}
      </div>
    </div>
  );
};

export default ApiKeyInputBox;
