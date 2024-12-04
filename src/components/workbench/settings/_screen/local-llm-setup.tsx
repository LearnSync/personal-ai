import { open } from "@tauri-apps/plugin-shell";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { TickIcon } from "@/constants";
import { useLocalLLM } from "@/hooks/useLocalLLM";
import { cn } from "@/lib/utils";
import { H3, H4, P, Section } from "../_components";
import { Input } from "@/components/ui/input";
import * as React from "react";

enum EModelType {
  EMBED = "embed",
}

export const LocalLlmSetupSettingScreen = () => {
  const [newModel, setNewModel] = React.useState<string>("");

  // --- Hooks
  const ollamaInfo = useLocalLLM({});

  return (
    <section className="pr-5 overflow-y-auto">
      <H3>Local LLM Configuration</H3>

      <Card className="my-6">
        <CardHeader>
          <CardDescription>
            <div className="flex items-center w-full h-full gap-2">
              <span>Ollama</span>
              {ollamaInfo.isAvailable ? (
                <span className="flex items-center gap-2">
                  <span>available</span>
                  <TickIcon className="w-6 h-6" />
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <span>not available</span>
                  <X className="w-6 h-6 text-red-500" />
                </span>
              )}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {ollamaInfo.isAvailable ? (
            <div>
              Version: <span>{ollamaInfo.version}</span>
            </div>
          ) : (
            <div>
              <span>Download Ollama</span>
              <Button
                variant={"link"}
                className={cn("px-2")}
                onClick={() => {
                  open("https://ollama.com/download")
                    .then(() => {
                      console.log("External link opened successfully");
                    })
                    .catch((error) => {
                      console.error("Error opening link:", error);
                    });
                }}
              >
                https://ollama.com/download
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Section>
        <>
          <H4 className={cn("col-span-full")}>Set Conversation Models</H4>

          <div className="pl-1">
            <Select>
              <SelectTrigger className="w-64 bg-background">
                <SelectValue placeholder="No Model Selected" />
              </SelectTrigger>
              <SelectContent>
                {ollamaInfo.availableModels
                  ?.filter((m) =>
                    m.title?.includes(EModelType.EMBED) ? false : true
                  )
                  ?.map((m) => (
                    <SelectItem key={m.id} value={m.title}>
                      {m.title}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </>
      </Section>

      <Separator className="my-5 bg-muted-foreground rounded-xl" />

      <Section>
        <H4 className={cn("col-span-full")}>Set Embedding Models</H4>

        <div className="pb-1 pl-1">
          <Select>
            <SelectTrigger className="w-64 bg-background">
              <SelectValue placeholder="No Model Selected" />
            </SelectTrigger>
            <SelectContent>
              {ollamaInfo.availableModels
                ?.filter((m) =>
                  m.title?.includes(EModelType.EMBED) ? true : false
                )
                ?.map((m) => (
                  <SelectItem key={m.id} value={m.title}>
                    {m.title}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </Section>

      <Separator className="my-5 bg-muted-foreground rounded-xl" />

      <Section className="gap-1">
        <div className={cn("col-span-full")}>
          <H4>Install New Models</H4>
          <P className="text-sm">
            <span>Visit :</span>
            <Button
              variant={"link"}
              className="pl-2"
              onClick={() => {
                open("https://ollama.com/library")
                  .then(() => {
                    console.log("External link opened successfully");
                  })
                  .catch((error) => {
                    console.error("Error opening link:", error);
                  });
              }}
            >
              https://ollama.com/library
            </Button>
          </P>
        </div>

        <div className="flex items-center gap-5 p-1 col-span-full">
          <Input
            placeholder="i.e. llama3.2"
            className="bg-background w-80"
            onChange={(e) => {
              const { value } = e.target;

              if (value) {
                setNewModel(value);
              }
            }}
          />
          <Button className="ml-2" disabled={!newModel}>
            Install
          </Button>
        </div>
      </Section>
    </section>
  );
};

export default LocalLlmSetupSettingScreen;
