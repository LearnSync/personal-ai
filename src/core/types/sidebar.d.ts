export interface ISidebarChat {
  id: number | string;
  session_id: string;
  session_name: string;
  archived: boolean;
  favorite: boolean;
  created_at: string;
}

export interface ISidebarOption {
  id: string;
  label: string;
  actionIdentifier: SIDEBAR_ITEM_OPTION;
  action?: (data?: ISidebarChat) => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export interface ISidebarItem {
  id: string;
  label: string;
  isActive?: boolean;
  chat?: ISidebarChat;
  options?: ISidebarOption[];
}
