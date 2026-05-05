"use client";

import { useState, useTransition } from "react";
import { toggleStepAction, deleteStepAction, updateStepAction } from "@/lib/campaigns/actions";
import type { Step, StepStatus } from "@/lib/types";

const STEP_BORDER: Record<StepStatus, string> = {
  todo: "border-outline-variant/60",
  in_progress: "border-[#ff5c00]/60",
  done: "border-[#e9c349]/50",
};

const STEP_ICON: Record<StepStatus, string> = {
  todo: "radio_button_unchecked",
  in_progress: "pending",
  done: "check_circle",
};

const STEP_ICON_COLOR: Record<StepStatus, string> = {
  todo: "text-tertiary",
  in_progress: "text-[#ffb59a]",
  done: "text-[#e9c349]",
};

const STEP_LABEL: Record<StepStatus, string> = {
  todo: "Pendente",
  in_progress: "Em Progresso",
  done: "Concluído",
};

const STEP_LABEL_COLOR: Record<StepStatus, string> = {
  todo: "text-tertiary",
  in_progress: "text-[#ffb59a]",
  done: "text-[#e9c349]",
};

function nextStatus(s: StepStatus): StepStatus {
  return s === "todo" ? "in_progress" : s === "in_progress" ? "done" : "todo";
}

/* ── Edit Modal ─────────────────────────────────────────────────────────────── */
function EditModal({ step, onClose }: { step: Step; onClose: () => void }) {
  const [title, setTitle] = useState(step.title);
  const [description, setDescription] = useState(step.description ?? "");
  const [dueDate, setDueDate] = useState(step.due_date?.slice(0, 10) ?? "");
  const [status, setStatus] = useState<StepStatus>(step.status);
  const [saving, startSave] = useTransition();
  const [deleting, startDelete] = useTransition();

  function handleSave() {
    if (!title.trim()) return;
    startSave(async () => {
      await updateStepAction(step.id, {
        title: title.trim(),
        description: description.trim() || null,
        due_date: dueDate || null,
        status,
      });
      onClose();
    });
  }

  function handleDelete() {
    if (!confirm(`Deletar "${step.title}"?\nEsta ação não pode ser desfeita.`)) return;
    startDelete(async () => {
      await deleteStepAction(step.id);
      onClose();
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl flex flex-col gap-0 overflow-hidden"
        style={{
          background: "rgba(22,21,21,0.98)",
          border: "1px solid rgba(255,92,0,0.25)",
          boxShadow: "0 0 60px rgba(0,0,0,0.7), 0 0 30px rgba(255,92,0,0.08)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff5c00] text-[16px]">edit_note</span>
            <span className="text-xs font-bold uppercase tracking-widest text-tertiary">
              Editar Tarefa
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-tertiary hover:text-on-surface transition"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-5 px-6 py-5">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
              Título
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg px-3 py-2.5 text-sm text-on-surface bg-surface-container border border-outline-variant/40 focus:border-[#ff5c00]/60 outline-none transition-colors placeholder:text-tertiary"
              placeholder="Nome da tarefa..."
              autoFocus
            />
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
              Status
            </label>
            <div className="flex gap-2">
              {(["todo", "in_progress", "done"] as StepStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all ${
                    status === s
                      ? s === "todo"
                        ? "border-outline-variant bg-surface-container-high text-on-surface"
                        : s === "in_progress"
                          ? "border-[#ff5c00]/60 bg-[rgba(255,92,0,0.12)] text-[#ffb59a]"
                          : "border-[#e9c349]/60 bg-[rgba(233,195,73,0.12)] text-[#e9c349]"
                      : "border-outline-variant/30 bg-transparent text-tertiary hover:border-outline-variant/60"
                  }`}
                >
                  <span className={`material-symbols-outlined text-[13px] filled ${status === s ? STEP_ICON_COLOR[s] : "text-tertiary"}`}>
                    {STEP_ICON[s]}
                  </span>
                  {STEP_LABEL[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-lg px-3 py-2.5 text-sm text-on-surface bg-surface-container border border-outline-variant/40 focus:border-[#ff5c00]/60 outline-none transition-colors placeholder:text-tertiary resize-none"
              placeholder="Descreva a tarefa, prompt, notas..."
            />
          </div>

          {/* Due date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
              Prazo (opcional)
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-lg px-3 py-2.5 text-sm text-on-surface bg-surface-container border border-outline-variant/40 focus:border-[#ff5c00]/60 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-outline-variant/20">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting || saving}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest text-red-400/70 hover:text-red-400 hover:bg-red-400/10 border border-transparent hover:border-red-400/20 transition-all disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-[14px]">delete</span>
            Deletar
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving || deleting}
              className="px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest text-tertiary border border-outline-variant/40 hover:border-outline-variant/70 transition-all disabled:opacity-40"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!title.trim() || saving || deleting}
              className="px-5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-[#ff5c00] hover:bg-[#ff7b33] text-white transition-all hover:shadow-[0_0_15px_rgba(255,92,0,0.35)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              {saving ? (
                <>
                  <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
                  Salvando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[14px]">check</span>
                  Salvar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── FlowNodes ───────────────────────────────────────────────────────────────── */
export function FlowNodes({ steps }: { steps: Step[] }) {
  const [editing, setEditing] = useState<Step | null>(null);
  const [pending, startTransition] = useTransition();

  function handleCycleStatus(e: React.MouseEvent, step: Step) {
    e.stopPropagation();
    startTransition(async () => {
      await toggleStepAction(step.id, nextStatus(step.status));
    });
  }

  if (steps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 text-center gap-3 h-full">
        <span className="material-symbols-outlined text-[48px] text-tertiary">account_tree</span>
        <p className="text-xs text-tertiary font-bold uppercase tracking-widest">
          Adicione tarefas para ver o fluxo
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="absolute left-1/2 top-4 bottom-4 w-0 border-l-2 border-dashed border-[#ff5c00]/30 -translate-x-1/2 z-0 pointer-events-none" />

      {steps.map((step, i) => (
        <div
          key={step.id}
          className={`w-72 bg-[rgba(42,42,42,0.85)] backdrop-blur-xl border rounded-xl p-3 z-10 relative cursor-pointer group/card transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,92,0,0.12)] ${STEP_BORDER[step.status]}`}
          style={
            step.status === "in_progress"
              ? { boxShadow: "0 0 15px rgba(255,92,0,0.15), inset 0 0 12px rgba(255,92,0,0.06)" }
              : undefined
          }
          onClick={() => setEditing(step)}
        >
          {/* Status icon (click to cycle) + title */}
          <div className="flex items-center gap-2 mb-1 pr-7">
            <button
              type="button"
              title="Ciclar status"
              onClick={(e) => handleCycleStatus(e, step)}
              disabled={pending}
              className={`shrink-0 transition-transform hover:scale-110 disabled:opacity-50 ${STEP_ICON_COLOR[step.status]}`}
            >
              <span className="material-symbols-outlined text-[15px] filled">
                {STEP_ICON[step.status]}
              </span>
            </button>
            <span className="text-xs font-semibold text-on-surface truncate">
              {i + 1}. {step.title}
            </span>
          </div>

          {/* Edit hint (top-right) */}
          <span className="absolute top-2.5 right-2.5 opacity-0 group-hover/card:opacity-60 transition">
            <span className="material-symbols-outlined text-[13px] text-[#ffb59a]">open_in_new</span>
          </span>

          {step.description && (
            <p className="text-[10px] font-medium text-tertiary mb-2 leading-relaxed line-clamp-2 pl-[23px]">
              {step.description}
            </p>
          )}

          <div className="border-t border-outline-variant/20 pt-2 flex justify-between items-center mt-1">
            {step.due_date ? (
              <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-tertiary">
                <span className="material-symbols-outlined text-[11px]">calendar_today</span>
                {new Date(step.due_date).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                })}
              </div>
            ) : (
              <span />
            )}
            <span className={`text-[10px] font-bold uppercase tracking-widest ${STEP_LABEL_COLOR[step.status]}`}>
              {STEP_LABEL[step.status]}
            </span>
          </div>
        </div>
      ))}

      {editing && <EditModal step={editing} onClose={() => setEditing(null)} />}
    </>
  );
}
