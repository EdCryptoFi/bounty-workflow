import * as React from "react";

import { cn } from "@/lib/utils";
import { Badge } from "./badge";

export interface SectionHeaderProps {
  label: string;
  count?: number;
  actions?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  label,
  count,
  actions,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-3 flex items-center gap-2", className)}>
      <h2 className="typo-section-label">{label}</h2>
      {typeof count === "number" ? (
        <Badge tone="neutral" size="xs">
          {count}
        </Badge>
      ) : null}
      {actions ? <div className="ml-auto">{actions}</div> : null}
    </div>
  );
}
