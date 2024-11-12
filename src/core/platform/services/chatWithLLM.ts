/******************************************************************************************************************************
 * TODO: Currently, working on Local LLM | Other LLM implementation is pending @SOUMITRO-SAHA
 *****************************************************************************************************************************/

// import Anthropic from "@anthropic-ai/sdk";
// import OpenAI from "openai";
// import { Ollama } from "ollama/browser";

import { endpoint } from "@/config/endpoint";
import { ApiConfig } from "@/core/platform/settings/apiConfig";
import { EAiProvider } from "@/core/types/enum";
import { ILlmMessage } from "@/core/types/llm";

type OnText = (newText: string, fullText: string) => void;

interface ISendLLMMessageParams {
  messages: ILlmMessage[];
  onText: OnText;
  onFinalMessage: (input: string) => void;
  onError: (input: string) => void;
  apiConfig: ApiConfig;
}

interface ISendLLMMessageResponse {
  abort: () => void;
}

export class ChatService {
  private apiConfig: ApiConfig;

  constructor(apiConfig: ApiConfig) {
    this.apiConfig = apiConfig;
  }

  /**
   * Sends a message to the appropriate AI model and returns the response.
   * @param {ISendLLMMessageParams} params - Parameters for sending the message.
   * @returns {ISendLLMMessageResponse} - An abort function to cancel the request if necessary.
   */
  public sendMessage(params: ISendLLMMessageParams): ISendLLMMessageResponse {
    switch (this.apiConfig.getModel()) {
      // case EAiProvider.ANTHROPIC:
      //   return this.sendClaudeMsg(params);
      // case EAiProvider.OPENAI:
      //   return this.sendOpenAIMsg(params);
      // case EAiProvider.GREPTILE:
      //   return this.sendGreptileMsg(params);
      // case EAiProvider.OLLAMA:
      //   return this.sendOllamaMsg(params);
      case EAiProvider.LOCAL:
        return this.sendLocalLLMMsg(params);
      default:
        throw new Error(
          `Unsupported AI provider: ${this.apiConfig.getModel()}`
        );
    }
  }

  /** 
  private sendClaudeMsg({
    messages,
    onText,
    onFinalMessage,
  }: ISendLLMMessageParams): ISendLLMMessageResponse {
    const anthropic = new Anthropic({
      apiKey: this?.apiConfig?.anthropic?.apikey,
      dangerouslyAllowBrowser: true,
    });

    const stream = anthropic.messages.stream({
      model: this?.apiConfig?.anthropic?.model,
      max_tokens: parseInt(this?.apiConfig?.anthropic?.maxTokens),
      messages,
    });

    let didAbort = false;
    stream.on(
      "text",
      (newText, fullText) => !didAbort && onText(newText, fullText)
    );
    stream.on("finalMessage", (response) => {
      if (didAbort) return;
      const content = response.content
        .map((c) => (c.type === "text" ? c.text : ""))
        .join("\n");
      onFinalMessage(content);
    });

    return { abort: () => (didAbort = true) };
  }

  private sendOpenAIMsg({
    messages,
    onText,
    onFinalMessage,
    onError,
  }: ISendLLMMessageParams): ISendLLMMessageResponse {
    const openai = new OpenAI({
      apiKey: this.apiConfig.openai.apikey,
      dangerouslyAllowBrowser: true,
    });

    let didAbort = false;
    let fullText = "";

    openai.chat.completions
      .create({ model: "gpt-4-2024-08-06", messages, stream: true })
      .then(async (response) => {
        for await (const chunk of response) {
          if (didAbort) return;
          const newText = chunk.choices[0]?.delta?.content || "";
          fullText += newText;
          onText(newText, fullText);
        }
        onFinalMessage(fullText);
      })
      .catch((error) => {
        console.error("OpenAI Error:", error);
        onError(fullText);
      });

    return { abort: () => (didAbort = true) };
  }

  private sendOllamaMsg({
    messages,
    onText,
    onFinalMessage,
    onError,
  }: ISendLLMMessageParams): ISendLLMMessageResponse {
    const ollama = new Ollama({ host: this.apiConfig.ollama.endpoint });
    let didAbort = false;
    let fullText = "";

    ollama
      .chat({ model: this.apiConfig.ollama.model, messages, stream: true })
      .then(async (stream) => {
        for await (const chunk of stream) {
          if (didAbort) return;
          const newText = chunk.message.content;
          fullText += newText;
          onText(newText, fullText);
        }
        onFinalMessage(fullText);
      })
      .catch((error) => {
        console.error("Ollama Error:", error);
        onError(fullText);
      });

    return { abort: () => (didAbort = true) };
  }

  private sendGreptileMsg({
    messages,
    onText,
    onFinalMessage,
    onError,
  }: ISendLLMMessageParams): ISendLLMMessageResponse {
    let didAbort = false;
    let fullText = "";

    fetch("https://api.greptile.com/v2/query", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiConfig.greptile.apikey}`,
        "X-Github-Token": this.apiConfig.greptile.githubPAT,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
        stream: true,
        repositories: [this.apiConfig.greptile.repoinfo],
      }),
    })
      .then((response) => response.text())
      .then((text) => JSON.parse(`[${text.trim().split("\n").join(",")}]`))
      .then((responseArr) => {
        responseArr.forEach(
          ({ type, message }: { type: string; message: string }) => {
            if (type === "message" && !didAbort) {
              fullText += message;
              onText(message, fullText);
            }
          }
        );
        onFinalMessage(fullText);
      })
      .catch((e) => {
        console.error("Greptile Error:", e);
        onError(fullText);
      });

    return { abort: () => (didAbort = true) };
  }
*/
  private sendLocalLLMMsg({
    messages,
    onText,
    onFinalMessage,
    onError,
  }: ISendLLMMessageParams): ISendLLMMessageResponse {
    let didAbort = false;
    let fullText = "";

    // Make the fetch request
    const controller = new AbortController();
    const signal = controller.signal;

    fetch(endpoint.CHAT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages,
        model: this.apiConfig.getModel(),
        variant: this.apiConfig.getVariant(),
      }),
      signal: signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("Failed to get reader from response body");
        }

        const decoder = new TextDecoder("utf-8");

        const readStream = () => {
          reader
            .read()
            .then(({ done, value }) => {
              if (done) {
                onFinalMessage(fullText);
                return;
              }

              const chunk = decoder.decode(value, { stream: true });
              fullText += chunk;
              onText(chunk, fullText);

              readStream();
            })
            .catch((error) => {
              if (!didAbort) {
                console.error("Local LLM Error:", error);
                onError(fullText);
              }
            });
        };

        readStream();
      })
      .catch((error) => {
        if (!didAbort) {
          console.error("Local LLM Error:", error);
          onError(fullText);
        }
      });

    return {
      abort: () => {
        didAbort = true;
        controller.abort();
      },
    };
  }
}

export default ChatService;
