import { open } from "@tauri-apps/plugin-shell";
import { Check, Info, Loader2, Trash2, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TickIcon } from "@/constants";
import { useApiConfigStore } from "@/core/reactive/store/config/apiConfigStore";
import { useToast } from "@/hooks/use-toast";
import { useLocalLLM } from "@/hooks/useLocalLLM";
import { cn } from "@/lib/utils";
import { H3, H4, H5, P, Section } from "../_components";

import { EAiProvider } from "@/core/types/enum";

enum EModelType {
  EMBED = "embed",
}

export const LocalLlmSetupSettingScreen = () => {
  const [newModel, setNewModel] = React.useState<string>("");

  // --- Hooks
  const ollamaInfo = useLocalLLM({});
  const { toast } = useToast();

  // --- Store
  const { localConfigs, embeddingConfigs, addLocalConfig } =
    useApiConfigStore();

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
                      toast({
                        title:
                          "Opening the external link. Wait for a minute...",
                      });
                    })
                    .catch((error) => {
                      console.error("Error opening link:", error);
                      toast({
                        title: "Error opening link",
                        description: error.message,
                      });
                    });
                }}
              >
                https://ollama.com/download
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Section className="gap-1 mb-6">
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
                    toast({
                      title: "Opening the external link. Wait for a minute...",
                    });
                  })
                  .catch((error) => {
                    console.error("Error opening link:", error);
                    toast({
                      title: "Error opening link",
                      description: error.message,
                    });
                  });
              }}
            >
              https://ollama.com/library
            </Button>
          </P>

          <P className="text-sm text-muted-foreground">
            <div>
              If the actual command is{" "}
              <span className="p-1 font-mono text-red-500 rounded bg-background-2">
                ollama run llama3.2:1b
              </span>
            </div>
            <div>
              simply enter{" "}
              <span className="p-1 font-mono text-red-500 rounded bg-background-2">
                llama3.2:1b
              </span>
            </div>
          </P>
        </div>

        <div className="flex items-center gap-5 p-1 col-span-full">
          <Input
            placeholder="i.e. llama3.2:1b"
            className="h-10 bg-background w-80"
            onChange={(e) => {
              const { value } = e.target;

              if (value) {
                setNewModel(value);
              }
            }}
          />

          <Button
            disabled={
              ollamaInfo.modelInstalling ? true : newModel ? false : true
            }
            onClick={async () => {
              await ollamaInfo.installNewModel(newModel);
            }}
          >
            {ollamaInfo.modelInstalling && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
            Install
          </Button>
        </div>

        {ollamaInfo.modelInstallUninstall &&
          ollamaInfo.modelInstallUninstall.action === "install" && (
            <pre className="px-3 mt-2 text-xs rounded-xl bg-background-2 col-span-full text-muted-foreground">
              {ollamaInfo.modelInstallUninstall.message ? (
                <P>{ollamaInfo.modelInstallUninstall.message}</P>
              ) : ollamaInfo.modelInstallUninstall.error ? (
                <P>{ollamaInfo.modelInstallUninstall.error}</P>
              ) : null}
            </pre>
          )}
      </Section>

      <Section className="gap-2 mt-10">
        <H4 className="col-span-full">Set Models</H4>

        <div className="col-span-6">
          <H5 className="mb-2">Conversation Models</H5>

          <div className="pl-1">
            <Select
              value={localConfigs?.[0].variant}
              onValueChange={(value) => {
                addLocalConfig(EAiProvider.LOCAL, {
                  model: EAiProvider.LOCAL,
                  variant: value,
                  apikey: "",
                });
              }}
            >
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
        </div>

        <div className="col-span-6">
          <H5 className="mb-2">Embedding Models</H5>

          <div className="pb-1 pl-1">
            <Select
              value={embeddingConfigs?.[0]?.variant}
              onValueChange={(value) => {
                addLocalConfig(EAiProvider.EMBEDDING, {
                  model: EAiProvider.EMBEDDING,
                  variant: value,
                  apikey: "",
                });
              }}
            >
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
        </div>
      </Section>

      <Section className="gap-2 pb-32 mt-10">
        <div className="col-span-full">
          <H4>Uninstall Models</H4>

          {ollamaInfo.modelInstallUninstall &&
            ollamaInfo.modelInstallUninstall.action === "uninstall" && (
              <div
                className={cn(
                  "p-1 px-5 rounded-lg bg-background-2 text-success"
                )}
              >
                {ollamaInfo.modelInstallUninstall?.message ? (
                  <P className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    {ollamaInfo.modelInstallUninstall?.message}
                  </P>
                ) : ollamaInfo.modelInstallUninstall?.error ? (
                  <P>{ollamaInfo.modelInstallUninstall.error}</P>
                ) : null}
              </div>
            )}
        </div>

        <Card className="col-span-full">
          <CardHeader>
            <CardDescription>
              <div className="flex flex-col gap-3">
                {ollamaInfo.availableModels?.map((model) => (
                  <div
                    key={model.id}
                    className="flex items-center justify-between p-3 px-5 text-base bg-background-1 rounded-xl"
                  >
                    <div className="flex items-center">
                      <div className="mr-2">{model.title}</div>
                      <div>[{model.size}]</div>
                      <div className="ml-1 text-xs">
                        (installed {model.modifier})
                      </div>

                      <Popover>
                        <PopoverTrigger>
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              ollamaInfo.fetchModelDetails(model.title);
                            }}
                          >
                            <Info className="w-4 h-4 ml-2" />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="min-w-fit">
                          {model.details ? (
                            <pre
                              style={{
                                whiteSpace: "pre",
                                fontFamily: "monospace",
                              }}
                            >
                              {model.details}
                            </pre>
                          ) : ollamaInfo.error ? (
                            ollamaInfo.error
                          ) : (
                            "Model Information not available!"
                          )}
                        </PopoverContent>
                      </Popover>
                    </div>

                    <Button
                      variant={"destructive"}
                      size={"icon"}
                      disabled={ollamaInfo.modelUninstalling ? true : false}
                      onClick={() => {
                        ollamaInfo.uninstallModel(model.title);
                      }}
                    >
                      {ollamaInfo.modelUninstalling ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <Trash2 className="w-6 h-6" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </CardDescription>
          </CardHeader>
        </Card>
      </Section>
    </section>
  );
};

export default LocalLlmSetupSettingScreen;
