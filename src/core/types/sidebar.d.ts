export interface ISidebarItem {
  id: string;
  label: string;
  isActive?: boolean;
  options?: {
    id: string;
    label: string;
    action: () => void;
    icon?: React.ReactNode;
    disabled?: boolean;
    className?: string;
  }[];
}

export enum EChatHistoryTime {
  TODAY = "today",
  YESTERDAY = "yesterday",
  PAST_7_DAYS = "week",
  PAST_30_DAYS = "month",
}
