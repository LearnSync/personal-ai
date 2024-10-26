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
