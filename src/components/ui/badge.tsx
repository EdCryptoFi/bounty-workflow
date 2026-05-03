import * as React from "react";

import { cn } from "@/lib/utils";

export type BadgeTone =
  | "neutral"
  | "success"
  | "warning"
  | "info"
  | "danger"
  | "mint";
export type BadgeSize = "xs" | "sm";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  size?: BadgeSize;
  icon?: React.ReactNode;
}

function toneClasses(tone: BadgeTone): string {
  switch (tone) {
    case "success":
      return "bg-[rgba(233,195,73,0.1)] text-[#e9c349] border border-[rgba(233,195,73,0.25)]";
    case "warning":
      return "bg-[rgba(233,195,73,0.08)] text-[#e9c349] border border-[rgba(233,195,73,0.2)]";
    case "info":
      return "bg-info-soft text-info-foreground border border-info/20";
    case "danger":
      return "bg-red-900/20 text-red-400 border border-red-900/40";
    case "mint":
      return "bg-[rgba(255,181,154,0.1)] text-[#ffb59a] border border-[rgba(255,181,154,0.25)]";
    case "neutral":
    default:
      return "bg-surface-container text-tertiary border border-outline-variant/30";
  }
}

function sizeClasses(size: BadgeSize): string {
  switch (size) {
    case "xs":
      return "text-[10px] px-2 py-0.5";
    case "sm":
    default:
      return "text-xs px-2.5 py-1";
  }
}

export function Badge({
  tone = "neutral",
  size = "sm",
  icon,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        toneClasses(tone),
        sizeClasses(size),
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </span>
  );
}
