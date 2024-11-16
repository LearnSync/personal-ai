export type IRoleLlm = "user" | "assistant";

export interface ILlmMessage {
  id: string;
  role: IRoleLlm;
  message: string;
}
