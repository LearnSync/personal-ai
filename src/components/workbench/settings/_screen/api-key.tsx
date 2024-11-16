import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AI_MODEL_VARIANTS } from "@/constants";
import { generateUUID } from "@/core";
import { EAiProvider } from "@/core/types/enum";
import { Plus } from "lucide-react";
import { H3, INotice, NoticeBoard } from "../_components";
import { ApiKeyInputBox } from "../_components/api-key-input-box";
import { useApiConfigStore } from "@/core/reactive/store/config/apiConfigStore";

const notice: INotice[] = [
  {
    key: generateUUID(),
    label:
      "The external APIs are provided by the respective AI providers. Currently, we only support OpenAI, Gemini, and Claude AI. Any information stored by these providers is beyond our responsibility; we merely utilise their services to establish communication.",
  },
  {
    key: generateUUID(),
    label: `We do not collect any of your information to any cloud service or anywhere else. All data is stored locally on your machine's database, which serves as the primary storage for vectors and embeddings.`,
  },
  {
    key: generateUUID(),
    label: `Since all data is stored locally on your database, if you uninstall or delete the database manually without taking backups, the data will be permanently lost. We are not liable for any data loss.`,
  },
  {
    key: generateUUID(),
    label: `We highly recommend reading our privacy policy to learn more. (It can be found on the left side.)`,
  },
];

export const ApiKeySettingScreen = () => {
  const {
    anthropicConfigs,
    geminiConfigs,
    openaiConfigs,
    ollamaConfigs,
    addConfig,
  } = useApiConfigStore();

  return (
    <section className="pr-5 overflow-y-auto">
      <H3 className="uppercase">API Key</H3>

      <NoticeBoard items={notice} />

      <p className="p-4 my-4 bg-primary/80 text-black text-center rounded-xl text-sm font-[500] shadow-inner uppercase">
        To Add the API Key Click the Plus (+) Button
      </p>

      <div className="flex flex-col gap-2 mt-5">
        <div className="px-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-[500]">{EAiProvider.OPENAI}</h4>
              {openaiConfigs.length === 0 && (
                <span className="text-xs text-red-500 font-[500]">
                  ( No Key Set )
                </span>
              )}
            </div>
            <Button
              onClick={() =>
                addConfig("openaiConfigs", {
                  apikey: "",
                  model: EAiProvider.OPENAI,
                  variant: null,
                })
              }
              variant={"ghost"}
              size={"icon"}
            >
              <Plus />
            </Button>
          </div>

          <div className="flex flex-col mt-2 space-y-3">
            {openaiConfigs.map((openAiConfig, idx) => (
              <ApiKeyInputBox
                key={idx}
                apiKey={openAiConfig.apikey}
                keyFor={EAiProvider.OPENAI}
                variants={AI_MODEL_VARIANTS.OPENAI}
                idx={idx}
              />
            ))}
          </div>
        </div>

        <Separator className="my-2 bg-muted-foreground" />

        <div className="px-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-[500]">{EAiProvider.GEMINI}</h4>
              {geminiConfigs.length === 0 && (
                <span className="text-xs text-red-500 font-[500]">
                  ( No Key Set )
                </span>
              )}
            </div>
            <Button
              onClick={() =>
                addConfig("geminiConfigs", {
                  apikey: "",
                  model: EAiProvider.OLLAMA,
                  variant: null,
                })
              }
              variant={"ghost"}
              size={"icon"}
            >
              <Plus />
            </Button>
          </div>

          <div className="mt-2">
            {geminiConfigs.map((geminiConfig, idx) => (
              <ApiKeyInputBox
                key={idx}
                apiKey={geminiConfig.apikey}
                keyFor={EAiProvider.OPENAI}
                variants={AI_MODEL_VARIANTS.OPENAI}
                idx={idx}
              />
            ))}
          </div>
        </div>

        <Separator className="my-2 bg-muted-foreground" />

        <div className="px-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-[500] capitalize">
                {EAiProvider.ANTHROPIC}
              </h4>

              {anthropicConfigs.length === 0 && (
                <span className="text-xs text-red-500 font-[500]">
                  ( No Key Set )
                </span>
              )}
            </div>
            <Button
              onClick={() =>
                addConfig("anthropicConfigs", {
                  apikey: "",
                  model: EAiProvider.OLLAMA,
                  variant: null,
                })
              }
              variant={"ghost"}
              size={"icon"}
            >
              <Plus />
            </Button>
          </div>

          <div className="mt-2">
            {anthropicConfigs.map((anthropicConfig, idx) => (
              <ApiKeyInputBox
                key={idx}
                apiKey={anthropicConfig.apikey}
                keyFor={EAiProvider.OPENAI}
                variants={AI_MODEL_VARIANTS.OPENAI}
                idx={idx}
              />
            ))}
          </div>
        </div>

        <Separator className="my-2 bg-muted-foreground" />

        <div className="px-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-[500] capitalize">
                {EAiProvider.OLLAMA}
              </h4>

              {ollamaConfigs.length === 0 && (
                <span className="text-xs text-red-500 font-[500]">
                  ( No Key Set )
                </span>
              )}
            </div>
            <Button
              onClick={() =>
                addConfig("ollamaConfigs", {
                  apikey: "",
                  model: EAiProvider.OLLAMA,
                  variant: null,
                })
              }
              variant={"ghost"}
              size={"icon"}
            >
              <Plus />
            </Button>
          </div>

          <div className="mt-2">
            {ollamaConfigs.map((ollamaConfig, idx) => (
              <ApiKeyInputBox
                key={idx}
                apiKey={ollamaConfig.apikey}
                keyFor={EAiProvider.OPENAI}
                variants={AI_MODEL_VARIANTS.OPENAI}
                idx={idx}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApiKeySettingScreen;
