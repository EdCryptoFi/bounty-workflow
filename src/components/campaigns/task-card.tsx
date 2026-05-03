"use client";

import { useTransition } from "react";
import { CheckCircle2, Circle, Loader2, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleStepAction } from "@/lib/campaigns/actions";
import type { Step } from "@/lib/types";

export function TaskCard({ step }: { step: Step }) {
  const [pending, startTransition] = useTransition();

  function cycle() {
    const next: Step["status"] =
      step.status === "todo"
        ? "in_progress"
        : step.status === "in_progress"
          ? "done"
          : "todo";
    startTransition(async () => {
      await toggleStepAction(step.id, next);
    });
  }

  const Icon =
    step.status === "done"
      ? CheckCircle2
      : step.status === "in_progress"
        ? Loader2
        : Circle;

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border border-border bg-card p-3 transition hover:border-mint-300",
        step.status === "done" && "opacity-70",
      )}
    >
      <button
        type="button"
        onClick={cycle}
        disabled={pending}
        className={cn(
          "mt-0.5 shrink-0 rounded-full transition",
          step.status === "done" && "text-mint-600",
          step.status === "in_progress" && "text-mint-500",
          step.status === "todo" && "text-muted-foreground hover:text-foreground",
        )}
        aria-label={`Marcar como ${step.status === "done" ? "a fazer" : "próximo"}`}
      >
        <Icon
          className={cn(
            "h-5 w-5",
            step.status === "in_progress" && "animate-spin",
          )}
        />
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm font-medium",
            step.status === "done" && "line-through",
          )}
        >
          {step.title}
        </p>
        {step.description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{step.description}</p>
        )}
        {step.due_date && (
          <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {new Date(step.due_date).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
            })}
          </div>
        )}
      </div>
    </div>
  );
}
