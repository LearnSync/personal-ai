import { EAiProvider } from "@/core/types/enum";
import { IApiConfig } from "@/core/types/appConfig";
import SessionManager from "../sessionManager";
import ChatSessionManager from "../chatSessionManager";
import TabSessionManager from "../tabSessionManager";
import { ChatService } from "../../services";

jest.mock("./chatSessionManager");
jest.mock("./tabSessionManager");
jest.mock("../services");

describe("SessionManager", () => {
  let sessionManager: SessionManager;
  let apiConfig: IApiConfig;

  beforeEach(() => {
    apiConfig = {
      /* Populate with mock config values */
    } as IApiConfig;

    ChatSessionManager.getInstance.mockReturnValue({
      startNewChat: jest.fn(),
      getChatSession: jest.fn(),
      addChatMessage: jest.fn(),
      closeChat: jest.fn(),
      setAbortFunction: jest.fn(),
      setActiveChatSessions: jest.fn(),
    });

    TabSessionManager.getInstance.mockReturnValue({
      createTab: jest.fn(),
      onTabClose: jest.fn(),
      closeAllTabs: jest.fn(),
    });

    ChatService.prototype.sendMessage = jest.fn(() => ({
      abort: jest.fn(),
    }));

    sessionManager = new SessionManager({ apiConfig });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should start a new chat session with the specified AI provider", () => {
    const tabId = "testTab";
    const aiProvider = EAiProvider.OPENAI;

    sessionManager.startChatSession(tabId, aiProvider);

    expect(ChatSessionManager.getInstance().startNewChat).toHaveBeenCalledWith(
      tabId,
      aiProvider
    );
    expect(TabSessionManager.getInstance().createTab).toHaveBeenCalledWith(
      tabId
    );
  });

  it("should close all chat and tab sessions", () => {
    sessionManager.closeAllSessions();

    expect(
      ChatSessionManager.getInstance().setActiveChatSessions
    ).toHaveBeenCalledWith(false);
    expect(TabSessionManager.getInstance().closeAllTabs).toHaveBeenCalled();
  });

  it("should handle tab close and close associated chat session", () => {
    const tabId = "testTab";

    sessionManager["handleTabClose"](tabId);

    expect(ChatSessionManager.getInstance().closeChat).toHaveBeenCalledWith(
      tabId
    );
  });

  it("should send a message to LLM and handle responses", async () => {
    const tabId = "testTab";
    const message = "Hello AI";
    const onText = jest.fn();
    const onFinalMessage = jest.fn();
    const onError = jest.fn();

    const chatSessionMock = { messages: [{ content: "Hello AI" }] };
    ChatSessionManager.getInstance().getChatSession.mockReturnValue(
      chatSessionMock
    );

    await sessionManager.sendMessageToLLM(
      tabId,
      message,
      onText,
      onFinalMessage,
      onError
    );

    expect(
      ChatSessionManager.getInstance().addChatMessage
    ).toHaveBeenCalledWith(tabId, message);

    expect(ChatService.prototype.sendMessage).toHaveBeenCalledWith({
      messages: chatSessionMock.messages,
      apiConfig,
      onText: expect.any(Function),
      onFinalMessage: expect.any(Function),
      onError: expect.any(Function),
    });
  });

  it("should handle error during sendMessageToLLM", async () => {
    const tabId = "testTab";
    const message = "Hello AI";
    const onText = jest.fn();
    const onFinalMessage = jest.fn();
    const onError = jest.fn();

    const chatSessionMock = { messages: [{ content: "Hello AI" }] };
    ChatSessionManager.getInstance().getChatSession.mockReturnValue(
      chatSessionMock
    );

    // Simulate an error in the sendMessage method
    ChatService.prototype.sendMessage.mockImplementation(() => {
      throw new Error("Test error");
    });

    await sessionManager.sendMessageToLLM(
      tabId,
      message,
      onText,
      onFinalMessage,
      onError
    );

    expect(onError).toHaveBeenCalledWith(new Error("Test error"));
    expect(
      ChatSessionManager.getInstance().addChatMessage
    ).toHaveBeenCalledWith(tabId, "An error occurred. Please try again.");
  });
});
