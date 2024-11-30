import { generateUUID, Platform } from "@/core";
import { EXTENSION_KEY } from "@/core/types/enum";

export interface IShortCut {
  key: Platform; // i.e. "window";
  modifiers: string[]; // i.e. ["ctrl", "shift"];
}

export type Subscriber = () => void;

export interface IDefaultExtensionItems {
  id: string;
  identificationKey: string;
  label: string;
  shortCut?: IShortCut[];
  hasMore?: boolean;
  displaySidebar?: boolean;
  position?: "default" | "bottom";
  newTab?: boolean;
}

/**
 * Generates the shortcut keys for a given key, ctrl, and shift.
 *
 * @param {string} key - The key to be used in the shortcut.
 * @param {boolean=} ctrl - Whether to include ctrl in the shortcut (default: true).
 * @param {boolean=} shift - Whether to include shift in the shortcut (default: true).
 *
 * @returns {Array<{ key: string, modifiers: Array<string> }>} An array of objects containing the platform and its corresponding modifiers.
 */
export function generateShortCuts({
  key,
  ctrl = false,
  shift = false,
  alt = false,
}: {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
}): IShortCut[] {
  const modifiers = [
    ctrl ? "ctrl" : null,
    shift ? "shift" : null,
    alt ? "alt" : null,
    key,
  ].filter(Boolean) as string[];

  return [
    { key: Platform.Windows, modifiers },
    {
      key: Platform.Mac,
      modifiers: modifiers.map((mod) => (mod === "ctrl" ? "cmd" : mod)),
    },
    { key: Platform.Linux, modifiers },
  ];
}

export const APPLICATION_SHORTCUTS = {
  CHAT: generateShortCuts({ key: "c", ctrl: true, shift: true }),
  CONTEXT_SEARCH: generateShortCuts({ key: "f", ctrl: true, shift: true }),
  IMPORTANT_CHAT: generateShortCuts({ key: "i", ctrl: true, shift: true }),
  CHAT_HISTORY: generateShortCuts({ key: "h", ctrl: true, shift: true }),
  BOOKMARKED_CHATS: generateShortCuts({ key: "b", ctrl: true, shift: true }),
  ARCHIVED_CHATS: generateShortCuts({ key: "a", ctrl: true, shift: true }),
  EXTENSIONS: generateShortCuts({ key: "x", ctrl: true, shift: true }),
  SETTINGS: generateShortCuts({ key: "s", ctrl: true, shift: true }),
  NEW_TAB: generateShortCuts({ key: "t", ctrl: true }),
  CLOSE_TAB: generateShortCuts({ key: "w", ctrl: true }),
  TOGGLE_SIDEBAR: generateShortCuts({ key: "s", ctrl: true, alt: true }),
};

export const DEFAULT_EXTENSIONS_ITEMS: Readonly<IDefaultExtensionItems>[] = [
  {
    id: generateUUID(),
    label: "Chat",
    identificationKey: EXTENSION_KEY.CHAT,
    shortCut: APPLICATION_SHORTCUTS.CHAT,
    displaySidebar: true,
    hasMore: false,
  },
  {
    id: generateUUID(),
    label: "Context Search",
    identificationKey: EXTENSION_KEY.CONTEXT_SEARCH,
    shortCut: APPLICATION_SHORTCUTS.CONTEXT_SEARCH,
    displaySidebar: true,
    hasMore: false,
    newTab: false,
  },
  {
    id: generateUUID(),
    label: "Important Chat",
    identificationKey: EXTENSION_KEY.IMPORTANT_CHAT,
    shortCut: APPLICATION_SHORTCUTS.IMPORTANT_CHAT,
    displaySidebar: true,
    hasMore: false,
    newTab: false,
  },
  {
    id: generateUUID(),
    label: "Extensions",
    identificationKey: EXTENSION_KEY.EXTENSION,
    shortCut: APPLICATION_SHORTCUTS.EXTENSIONS,
    displaySidebar: true,
    hasMore: false,
    newTab: false,
  },
  {
    id: generateUUID(),
    label: "Settings",
    identificationKey: EXTENSION_KEY.SETTINGS,
    shortCut: APPLICATION_SHORTCUTS.SETTINGS,
    displaySidebar: true,
    hasMore: false,
    position: "bottom",
    newTab: true,
  },
];

export const AI_MODEL_VARIANTS = {
  OLLAMA: [
    "llama3.2",
    "llama3.1",
    "gemma2",
    "qwen2.5",
    "phi3.5",
    "nemotron-mini",
    "mistral-small",
    "mistral-nemo",
    "deepseek-coder-v2",
    "mistral",
    "mixtral",
    "codegemma",
    "command-r",
    "command-r-plus",
    "llava",
    "llama3",
    "gemma",
    "qwen",
    "qwen3",
    "phi3",
    "codellama",
    "deepseek-coder",
  ],
  OPENAI: [
    "gpt-3.5-turbo",
    "gpt-4o-mini",
    "gpt-4o",
    "o1-mini",
    "gpt-4o-2024-08-06",
    "gpt-4o-audio-preview",
    "gpt-4o-audio-preview-2024-10-01",
    "gpt-4o-2024-05-13",
    "gpt-4o-mini-2024-07-18",
    "o1-preview",
    "o1-mini-2024-09-12",
    "text-embedding-3-small",
    "text-embedding-3-large",
    "davinci-002",
    "babbage-002",
    "Whisper",
    "TTS",
    "TTS HD",
  ],
  GEMINI: [
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-1.5-pro",
    "gemini-1.0-pro",
    "text-embedding-004",
    "aqa",
  ],
  ANTHROPIC: [
    "claude-3-5-sonnet-20241022",
    "claude-3-opus-20240229",
    "claude-3-sonnet-20240229",
    "claude-3-haiku-20240307",
  ],
};

export const TAB_COLORS = [
  "#ef4444",
  "#f59e0b",
  "#10b981",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#db2777",
  "#f8fafc",
];

const getStartOfDay = (date: Date): string => {
  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);
  return start.toISOString();
};

const getEndOfDay = (date: Date): string => {
  const end = new Date(date);
  end.setUTCHours(23, 59, 59, 999);
  return end.toISOString();
};

export const TIME = {
  TODAY: {
    START: getStartOfDay(new Date()), // Start of today (00:00:00.000)
    END: getEndOfDay(new Date()), // End of today (23:59:59.999)
  },
  YESTERDAY: {
    START: getStartOfDay(new Date(Date.now() - 86400000)), // Start of yesterday
    END: getEndOfDay(new Date(Date.now() - 86400000)), // End of yesterday
  },
  PAST_7_DAYS: {
    START: getStartOfDay(new Date(Date.now() - 604800000)), // Start of 7 days ago
    END: getEndOfDay(new Date(Date.now() - 86400000)), // Start of Yesterday
  },
  PAST_30_DAYS: {
    START: getStartOfDay(new Date(Date.now() - 2592000000)), // Start of 30 days ago
    END: getEndOfDay(new Date(Date.now() - 604800000)), // Start of Past 7 days
  },
};

// ----- Exports ----- //
export * from "./icon";
