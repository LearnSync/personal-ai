import { FileClock, MessageCircle, Settings } from "lucide-react";

enum ESystem {
  WIN,
  MAC,
  UNIX,
}

export interface IDefaultExtensionItems {
  icon: React.ReactNode;
  label: string;
  shortCut?: {
    key: ESystem; // i.e. "window";
    modifiers: string[]; // i.e. ["ctrl", "shift"];
  }[];
  hasMore?: boolean;
}

export const DEFAULT_EXTENSIONS_ITEMS: IDefaultExtensionItems[] = [
  {
    icon: <MessageCircle className="w-full h-full" />,
    label: "Chat",
    shortCut: [
      {
        key: ESystem.WIN,
        modifiers: ["ctrl", "shift", "c"],
      },
      {
        key: ESystem.MAC,
        modifiers: ["cmd", "shift", "c"],
      },
      {
        key: ESystem.UNIX,
        modifiers: ["ctrl", "shift", "c"],
      },
    ],
    hasMore: false,
  },
  {
    icon: <FileClock className="w-full h-full" />,
    label: "History",
    shortCut: [
      {
        key: ESystem.WIN,
        modifiers: ["ctrl", "shift", "c"],
      },
      {
        key: ESystem.MAC,
        modifiers: ["cmd", "shift", "c"],
      },
      {
        key: ESystem.UNIX,
        modifiers: ["ctrl", "shift", "c"],
      },
    ],
    hasMore: false,
  },
];

export const SETTINGS: IDefaultExtensionItems = {
  icon: <Settings className="w-full h-full" />,
  label: "Settings",
  shortCut: [
    {
      key: ESystem.WIN,
      modifiers: ["ctrl", "shift", "s"],
    },
    {
      key: ESystem.MAC,
      modifiers: ["cmd", "shift", "s"],
    },
    {
      key: ESystem.UNIX,
      modifiers: ["ctrl", "shift", "s"],
    },
  ],
  hasMore: false,
};
