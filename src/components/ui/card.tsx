import * as React from "react";

import { cn } from "@/lib/utils";

export type CardVariant = "default" | "muted" | "dashed";
export type CardPadding = "tight" | "comfortable" | "loose";

type AsProp = keyof React.JSX.IntrinsicElements;

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  as?: AsProp;
}

function variantClasses(variant: CardVariant): string {
  switch (variant) {
    case "muted":
      return "border border-outline-variant/20 bg-surface-container/60 backdrop-blur-xl";
    case "dashed":
      return "border border-dashed border-outline-variant/30 bg-surface-container/40";
    case "default":
    default:
      return "border border-outline-variant/30 bg-surface-container-highest/70 backdrop-blur-xl";
  }
}

function paddingClasses(padding: CardPadding): string {
  switch (padding) {
    case "tight":
      return "p-4";
    case "loose":
      return "p-8";
    case "comfortable":
    default:
      return "p-6";
  }
}

export function Card({
  variant = "default",
  padding = "comfortable",
  as = "div",
  className,
  children,
  ...props
}: CardProps) {
  const Comp = as as React.ElementType;
  return (
    <Comp
      className={cn(
        "rounded-xl",
        variantClasses(variant),
        paddingClasses(padding),
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mb-4 flex items-start justify-between gap-3", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-4 border-t border-border pt-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}
