import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EAiProvider } from "@/core/types/enum";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import * as React from "react";

interface ApiKeyInputBoxProps {
  keyFor: EAiProvider;
  idx: number;

  className?: string;
  variants: string[];
  apiKey?: string;
}

export const ApiKeyInputBox: React.FC<ApiKeyInputBoxProps> = ({
  className,
  ...props
}) => {
  const [apiKey, setApiKey] = React.useState(props.apiKey ?? "");
  const [showKey, setShowKey] = React.useState(false);

  const handleSave = () => {};
  const handleDelete = () => {};
  const handleUpdate = () => {};

  return (
    <div className="" {...props}>
      <div className="flex items-center space-x-5">
        <Input
          type={apiKey && showKey ? "text" : "password"}
          className={cn("border border-primary", className)}
          value={apiKey}
          onChange={(e) => {
            const value = e.target.value;
            setApiKey(value);
          }}
        />

        {/* Model Variant */}
        <Select>
          <SelectTrigger className="w-40 bg-background-2">
            <SelectValue placeholder="Variant" />
          </SelectTrigger>
          <SelectContent className="bg-background-2">
            {props.variants.map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {apiKey && (
          <div className="flex items-center space-x-3">
            <Button
              size={"icon"}
              variant={"secondary"}
              onClick={() => setShowKey((prev) => !prev)}
            >
              {showKey ? <EyeOff /> : <Eye />}
            </Button>

            <Button variant={"destructive"} size={"icon"}>
              <Trash2 />
            </Button>

            <Button size={"sm"}>Save</Button>
          </div>
        )}
      </div>
      {props.keyFor && (
        <p className="mt-2 text-xs text-muted-foreground">
          (Your {props.keyFor} API Key)
        </p>
      )}
    </div>
  );
};

export default ApiKeyInputBox;
