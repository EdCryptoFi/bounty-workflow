"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { toggleStepAction } from "@/lib/campaigns/actions";
import { XContentAnalyzer } from "@/components/x-analyzer/x-content-analyzer";
import type { Step } from "@/lib/types";

const STATUS_ICON: Record<Step["status"], string> = {
  todo: "radio_button_unchecked",
  in_progress: "pending",
  done: "check_circle",
};
const STATUS_ICON_COLOR: Record<Step["status"], string> = {
  todo: "text-tertiary hover:text-on-surface",
  in_progress: "text-[#ffb59a]",
  done: "text-[#e9c349]",
};
const STATUS_TEXT: Record<Step["status"], string> = {
  todo: "text-on-surface",
  in_progress: "text-[#ffb59a]",
  done: "text-tertiary line-through",
};

export function TaskCard({ step }: { step: Step }) {
  const [pending, startTransition] = useTransition();
  const [analyzerOpen, setAnalyzerOpen] = useState(false);

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

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg border border-transparent hover:border-outline-variant/30 hover:bg-surface-container-high/30 transition-colors cursor-pointer",
        step.status === "done" && "opacity-70",
      )}
    >
      <button
        type="button"
        onClick={cycle}
        disabled={pending}
        className={cn(
          "mt-0.5 shrink-0 transition",
          STATUS_ICON_COLOR[step.status],
          pending && "opacity-50",
        )}
        aria-label="Mudar status"
      >
        <span className={cn("material-symbols-outlined text-[20px]", step.status === "done" ? "filled" : "")}>
          {STATUS_ICON[step.status]}
        </span>
      </button>

      <div className="min-w-0 flex-1">
        <p className={cn("text-sm font-medium", STATUS_TEXT[step.status])}>
          {step.title}
        </p>
        <div className="mt-1.5 flex items-center gap-3 flex-wrap">
          {step.due_date && (
            <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-tertiary">
              <span className="material-symbols-outlined text-[12px]">calendar_today</span>
              {new Date(step.due_date).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
              })}
            </div>
          )}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setAnalyzerOpen((v) => !v); }}
            className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest transition-colors"
            style={{ color: analyzerOpen ? "#ff5c00" : "var(--color-tertiary)" }}
          >
            <span className="material-symbols-outlined text-[12px]">bolt</span>
            Analisar no X
          </button>
        </div>
        {analyzerOpen && (
          <div className="mt-3">
            <XContentAnalyzer initialContent={step.title} />
          </div>
        )}
      </div>
    </div>
  );
}
