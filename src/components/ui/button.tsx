import * as React from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "link";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 font-medium transition disabled:opacity-60 disabled:cursor-not-allowed";

function variantClasses(variant: ButtonVariant): string {
  switch (variant) {
    case "primary":
      return "bg-[#ff5c00] text-white hover:bg-[#ff7b33] hover:shadow-[0_0_20px_rgba(255,92,0,0.35)] active:scale-95 font-bold uppercase tracking-widest";
    case "secondary":
      return "border border-outline-variant/40 bg-surface-container text-on-surface hover:bg-surface-container-high hover:text-[#ffb59a] font-bold uppercase tracking-widest";
    case "ghost":
      return "text-tertiary hover:bg-surface-container hover:text-on-surface";
    case "danger":
      return "bg-red-900/40 text-red-300 border border-red-900/40 hover:bg-red-900/60";
    case "link":
      return "text-[#ffb59a] hover:text-[#ff5c00] hover:underline";
    default:
      return "";
  }
}

function sizeClasses(size: ButtonSize): string {
  switch (size) {
    case "sm":
      return "h-8 px-3 text-xs rounded-md";
    case "lg":
      return "h-12 px-6 text-base rounded-lg";
    case "md":
    default:
      return "h-10 px-4 text-sm rounded-lg";
  }
}

/** String helper para uso em <Link>, <a>, etc. */
export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
): string {
  return cn(BASE_CLASSES, variantClasses(variant), sizeClasses(size));
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      asChild = false,
      loading = false,
      iconLeft,
      iconRight,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) {
    const classes = cn(
      BASE_CLASSES,
      variantClasses(variant),
      sizeClasses(size),
      className,
    );

    const leadingIcon = loading ? (
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
    ) : (
      iconLeft
    );

    const content = (
      <>
        {leadingIcon}
        {children}
        {iconRight}
      </>
    );

    if (asChild && React.isValidElement(children)) {
      const child = React.Children.only(
        children,
      ) as React.ReactElement<{ className?: string }>;
      return React.cloneElement(child, {
        className: cn(classes, child.props.className),
      });
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {content}
      </button>
    );
  },
);
