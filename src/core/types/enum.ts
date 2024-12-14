export enum EAiProvider {
  ANTHROPIC = "anthropic",
  GREPTILE = "greptile",
  GEMINI = "gemini",
  OPENAI = "openai",
  OLLAMA = "ollama",
  LOCAL = "local",
  EMBEDDING = "embedding",
}

export enum EChatHistoryTime {
  TODAY = "today",
  YESTERDAY = "yesterday",
  PAST_7_DAYS = "week",
  PAST_30_DAYS = "month",
}

export enum EXTENSION_KEY {
  CHAT = "chat",
  CODE = "code",
  CONTEXT_SEARCH = "context_search",
  CHAT_WITH_PDF = "chat_with_pdf",
  IMPORTANT_CHAT = "important_chat",
  EXTENSION = "extension",
  SETTINGS = "settings",
}

export enum SIDEBAR_ITEM_OPTION {
  RENAME = "rename",
  BOOKMARK = "bookmark",
  ARCHIVED = "archived",
  IMPORTANT = "important",
  DELETE = "delete",
}
