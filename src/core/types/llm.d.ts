export type IRoleLlm = "user" | "assistant";

export interface ILlmMessage {
  message_id: string;
  role: IRoleLlm;
  content: string;
  model?: string;
}
