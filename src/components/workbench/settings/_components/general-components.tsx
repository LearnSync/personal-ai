import { cn } from "@/lib/utils";
import { Asterisk } from "lucide-react";
import * as React from "react";

export const H3 = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3 className={cn("text-lg font-[600] mb-3", className)} {...props}>
      {children}
    </h3>
  );
};

export const H4 = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h4 className={cn("text-base font-[500] mb-2", className)} {...props}>
      {children}
    </h4>
  );
};

export const H5 = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h5 className={cn("text-sm font-[400]", className)} {...props}>
      {children}
    </h5>
  );
};

export const P = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p className={cn("text-base font-[400] my-2", className)} {...props}>
      {children}
    </p>
  );
};

export const AsteriskIcon = ({ className }: { className?: string }) => {
  return <Asterisk className={cn("w-3 h-3", className)} />;
};

export interface INotice {
  key: string;
  label: string;
  onClick?: () => void;
}

export const NoticeBoard = ({ items = [] }: { items: INotice[] }) => {
  return (
    <div className="p-4 px-8 mx-auto text-xs shadow-inner bg-background-2 rounded-xl">
      {items.map((item, idx) => (
        <div
          key={item.key}
          className={cn(
            "flex items-start space-x-1 text-muted-foreground leading-relaxed",
            idx === 0 ? "mb-2" : " my-2"
          )}
          onCanPlay={item?.onClick}
        >
          <div className="min-w-3 min-h-3 max-w-3 max-h-3">
            <AsteriskIcon className="text-red-500" />
          </div>
          <p className="italic underline">{item.label}</p>
        </div>
      ))}
    </div>
  );
};

export const Section = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <section className={cn("grid w-full h-full grid-cols-12 gap-6", className)}>
      {children}
    </section>
  );
};
