import { ILlmMessage } from "@/core/types/llm";
import { ChatSessionManager } from "../chatSessionManager";
import { EAiProvider } from "@/core/types/enum";

describe("ChatSessionManager", () => {
  let chatSessionManager: ChatSessionManager;

  beforeEach(() => {
    chatSessionManager = ChatSessionManager.getInstance();
  });

  it("should start a new chat session", () => {
    const session = chatSessionManager.startNewChat(
      "session1",
      EAiProvider.OPENAI
    );
    expect(session).toHaveProperty("id", "session1");
    expect(session).toHaveProperty("aiProvider", EAiProvider.OPENAI);
    expect(session.isActive).toBe(true);
  });

  it("should close a chat session", () => {
    chatSessionManager.startNewChat("session2", EAiProvider.GEMINI);
    chatSessionManager.closeChat("session2");
    const session = chatSessionManager.getChatSession("session2");
    expect(session?.isActive).toBe(false);
  });

  it("should set chat messages", () => {
    chatSessionManager.startNewChat("session3", EAiProvider.ANTHROPIC);
    const messages: ILlmMessage[] = [{ content: "Hello", role: "user" }];
    chatSessionManager.setChatMessages("session3", messages);
    const sessionMessages = chatSessionManager.getChatMessages("session3");
    expect(sessionMessages).toEqual(messages);
  });

  it("should add a message to a chat session", () => {
    chatSessionManager.startNewChat("session4", EAiProvider.OLLAMA);
    chatSessionManager.addChatMessage("session4", "Test Message", "user");
    const sessionMessages = chatSessionManager.getChatMessages("session4");
    expect(sessionMessages).toHaveLength(1);
    expect(sessionMessages?.[0].content).toBe("Test Message");
  });

  it("should set an abort function and call it", () => {
    const mockAbortFunction = jest.fn();
    chatSessionManager.startNewChat("session5", EAiProvider.LOCAL);
    chatSessionManager.setAbortFunction("session5", mockAbortFunction);

    const session = chatSessionManager.getChatSession("session5");
    session?.abortFunction?.();
    expect(mockAbortFunction).toHaveBeenCalled();
  });

  it("should close all sessions", () => {
    chatSessionManager.startNewChat("session6", EAiProvider.GREPTILE);
    chatSessionManager.startNewChat("session7", EAiProvider.OPENAI);
    chatSessionManager.setActiveChatSessions(false);

    const activeSessions = chatSessionManager.getActiveChatSessions();
    expect(activeSessions).toHaveLength(0);
  });
});
