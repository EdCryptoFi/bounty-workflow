import * as React from "react";

import { cn } from "@/lib/utils";

export const inputClasses =
  "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-mint-500 focus:ring-2 focus:ring-mint-500/20 disabled:opacity-60";

export const textareaClasses =
  "w-full min-h-[80px] rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground focus:border-mint-500 focus:ring-2 focus:ring-mint-500/20 disabled:opacity-60";

export const selectClasses =
  "h-10 w-full appearance-none rounded-lg border border-border bg-background px-3 pr-8 text-sm outline-none transition placeholder:text-muted-foreground focus:border-mint-500 focus:ring-2 focus:ring-mint-500/20 disabled:opacity-60 bg-no-repeat bg-[right_0.75rem_center] bg-[length:1rem_1rem]";

export interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

export function Field({
  id,
  label,
  hint,
  error,
  className,
  children,
}: FieldProps) {
  const child = React.isValidElement(children)
    ? React.cloneElement(
        children as React.ReactElement<{ id?: string; "aria-invalid"?: boolean }>,
        {
          id,
          "aria-invalid": error ? true : undefined,
        },
      )
    : children;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="typo-label">
        {label}
      </label>
      {child}
      {error ? (
        <p className="text-xs text-danger">{error}</p>
      ) : hint ? (
        <p className="typo-caption">{hint}</p>
      ) : null}
    </div>
  );
}
