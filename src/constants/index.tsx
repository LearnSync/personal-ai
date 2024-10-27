import {
  Blocks,
  FileStack,
  MessageCircle,
  Search,
  Settings,
} from "lucide-react";

import { generateUUID, Platform } from "@/core";

export interface IShortCut {
  key: Platform; // i.e. "window";
  modifiers: string[]; // i.e. ["ctrl", "shift"];
}

export interface IDefaultExtensionItems {
  id: string;
  icon: React.ReactNode;
  label: string;
  shortCut?: IShortCut[];
  hasMore?: boolean;
  displaySidebar?: boolean;
  position?: "default" | "bottom";
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
function generateShortCuts({
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
    icon: <MessageCircle className="w-full h-full" />,
    label: "Chat",
    shortCut: APPLICATION_SHORTCUTS.CHAT,
    displaySidebar: true,
    hasMore: false,
  },
  {
    id: generateUUID(),
    icon: <Search className="w-full h-full" />,
    label: "Context Search",
    shortCut: APPLICATION_SHORTCUTS.CONTEXT_SEARCH,
    displaySidebar: true,
    hasMore: false,
  },
  {
    id: generateUUID(),
    icon: <FileStack className="w-full h-full" />,
    label: "Important Chat",
    shortCut: APPLICATION_SHORTCUTS.IMPORTANT_CHAT,
    displaySidebar: true,
    hasMore: false,
  },
  {
    id: generateUUID(),
    icon: <Blocks className="w-full h-full" />,
    label: "Extensions",
    shortCut: APPLICATION_SHORTCUTS.EXTENSIONS,
    displaySidebar: true,
    hasMore: false,
  },
  {
    id: generateUUID(),
    icon: <Settings className="w-full h-full" />,
    label: "Settings",
    shortCut: APPLICATION_SHORTCUTS.SETTINGS,
    displaySidebar: false,
    hasMore: false,
    position: "bottom",
  },
];
