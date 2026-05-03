import * as React from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Card, type CardPadding } from "./card";

export type EmptyStateSize = "sm" | "md" | "lg";

export interface EmptyStateAction {
  href?: string;
  onClick?: () => void;
  label: string;
  iconLeft?: React.ReactNode;
}

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  size?: EmptyStateSize;
  className?: string;
}

function paddingForSize(size: EmptyStateSize): CardPadding {
  switch (size) {
    case "sm":
      return "tight";
    case "lg":
      return "loose";
    case "md":
    default:
      return "comfortable";
  }
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  size = "md",
  className,
}: EmptyStateProps) {
  return (
    <Card
      variant="dashed"
      padding={paddingForSize(size)}
      className={cn("flex flex-col items-center text-center", className)}
    >
      {Icon ? (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-mint-50 text-mint-600 dark:bg-mint-900/20">
          <Icon className="h-6 w-6" aria-hidden />
        </div>
      ) : null}
      <h3 className="typo-h3">{title}</h3>
      {description ? (
        <p className="typo-caption mt-1 max-w-md">{description}</p>
      ) : null}
      {action ? (
        <div className="mt-4">
          {action.href ? (
            <Button asChild iconLeft={action.iconLeft}>
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ) : (
            <Button onClick={action.onClick} iconLeft={action.iconLeft}>
              {action.label}
            </Button>
          )}
        </div>
      ) : null}
    </Card>
  );
}
