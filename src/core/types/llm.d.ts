export interface ILlmMessage {
  role: "user" | "assistant";
  content: string;
}
