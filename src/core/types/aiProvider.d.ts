import * as React from "react";

export interface IAiModel {
  id: string;
  icon: React.ReactNode;
  label: string;
  model: string;
  variants: string[];
  action: () => void;
  className?: string;
}
