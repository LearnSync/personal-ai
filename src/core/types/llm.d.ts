export type IRoleLlm = "user" | "assistant";

export interface ILlmMessage {
  role: IRoleLlm;
  content: string;
}
