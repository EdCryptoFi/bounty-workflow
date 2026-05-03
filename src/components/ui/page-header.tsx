import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  back?: { href: string; label: string };
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  actions,
  back,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-3",
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        {back ? (
          <Link
            href={back.href}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            {back.label}
          </Link>
        ) : null}
        <h1 className="typo-h1">{title}</h1>
        {subtitle ? <p className="typo-caption">{subtitle}</p> : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
