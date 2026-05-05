"use client";

import { useState, useTransition } from "react";
import { addLinkAction, removeAttachmentAction, deleteStepAction } from "@/lib/campaigns/actions";
import { AddStepModal } from "./add-step-modal";
import type { Attachment, Step } from "@/lib/types";

export function FlowLeftPanel({
  campaignId,
  links,
  steps,
  driveFiles,
}: {
  campaignId: string;
  links: Attachment[];
  steps: Step[];
  driveFiles: Attachment[];
}) {
  return (
    <div className="w-1/3 flex flex-col gap-4 h-full overflow-y-auto pr-1">
      <LinksBox campaignId={campaignId} links={links} />
      <PromptsBox campaignId={campaignId} steps={steps} />
      <DriveBox campaignId={campaignId} driveFiles={driveFiles} />
    </div>
  );
}

function LinksBox({ campaignId, links }: { campaignId: string; links: Attachment[] }) {
  const [adding, setAdding] = useState(false);
  const [url, setUrl] = useState("");
  const [pending, startTransition] = useTransition();

  function handleAdd() {
    const trimmed = url.trim();
    if (!trimmed) return;
    startTransition(async () => {
      await addLinkAction(campaignId, trimmed);
      setUrl("");
      setAdding(false);
    });
  }

  function handleRemove(id: string) {
    startTransition(async () => {
      await removeAttachmentAction(id, campaignId);
    });
  }

  return (
    <div className="bg-[rgba(32,31,31,0.8)] border border-outline-variant/50 rounded-lg p-3 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-tertiary text-[14px]">link</span>
          Links
        </h3>
        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          className="text-tertiary hover:text-[#ff5c00] transition rounded p-0.5"
          title="Adicionar link"
        >
          <span className="material-symbols-outlined text-[14px]">add</span>
        </button>
      </div>

      {adding && (
        <div className="flex gap-1">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            autoFocus
            className="flex-1 text-[11px] rounded border border-outline-variant/50 bg-surface-container/50 px-2 py-1 text-on-surface placeholder:text-tertiary outline-none focus:border-[#ff5c00]/60"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
              if (e.key === "Escape") setAdding(false);
            }}
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={pending}
            className="text-[11px] text-[#ff5c00] font-bold px-2 py-1 rounded border border-[#ff5c00]/40 hover:bg-[#ff5c00]/10 transition disabled:opacity-50"
          >
            OK
          </button>
        </div>
      )}

      {links.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {links.map((a) => (
            <li key={a.id} className="flex items-center gap-2 group">
              <span className="material-symbols-outlined text-[12px] text-tertiary shrink-0">
                open_in_new
              </span>
              <a
                href={a.path}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-[10px] text-tertiary hover:text-[#ffb59a] font-bold uppercase tracking-widest truncate"
              >
                {a.path.replace(/^https?:\/\//, "").split("/")[0]}
              </a>
              <button
                type="button"
                onClick={() => handleRemove(a.id)}
                disabled={pending}
                className="opacity-0 group-hover:opacity-100 text-tertiary hover:text-red-400 transition shrink-0"
              >
                <span className="material-symbols-outlined text-[12px]">remove</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[10px] text-tertiary font-bold uppercase tracking-widest">
          Nenhum link
        </p>
      )}
    </div>
  );
}

function PromptModal({ step, onClose }: { step: Step; onClose: () => void }) {
  const slug = `/${step.title.toLowerCase().replace(/\s+/g, "_")}`;

  function handleCopy() {
    navigator.clipboard.writeText(step.description ?? slug);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl p-6 flex flex-col gap-4"
        style={{
          background: "rgba(28,27,27,0.95)",
          border: "1px solid rgba(255,92,0,0.2)",
          boxShadow: "0 0 40px rgba(0,0,0,0.6), inset 0 0 20px rgba(255,92,0,0.04)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-tertiary hover:text-on-surface transition"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Prompt slug */}
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[14px] text-[#ff5c00]">terminal</span>
          <span className="text-xs font-mono font-bold text-[#ffb59a]">{slug}</span>
        </div>

        <h3 className="text-base font-semibold text-on-surface pr-6">{step.title}</h3>

        {step.description ? (
          <div className="rounded-lg bg-surface-container/50 border border-outline-variant/30 p-3">
            <p className="text-xs font-mono text-tertiary leading-relaxed whitespace-pre-wrap">
              {step.description}
            </p>
          </div>
        ) : (
          <p className="text-[11px] text-tertiary/50 font-bold uppercase tracking-widest">
            Sem conteúdo
          </p>
        )}

        {step.description && (
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-tertiary hover:text-[#ffb59a] transition w-fit"
          >
            <span className="material-symbols-outlined text-[14px]">content_copy</span>
            Copiar conteúdo
          </button>
        )}
      </div>
    </div>
  );
}

function PromptsBox({ campaignId, steps }: { campaignId: string; steps: Step[] }) {
  const [selected, setSelected] = useState<Step | null>(null);
  const [pending, startTransition] = useTransition();

  function handleRemove(e: React.MouseEvent, stepId: string) {
    e.stopPropagation();
    startTransition(async () => {
      await deleteStepAction(stepId);
    });
  }

  return (
    <>
      <div className="bg-[rgba(32,31,31,0.8)] border border-outline-variant/50 rounded-lg p-3 flex flex-col gap-3 flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary text-[14px]">terminal</span>
            Prompts
          </h3>
          <AddStepModal campaignId={campaignId} compact />
        </div>

        {steps.length > 0 ? (
          <div className="flex flex-col gap-2">
            {steps.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-2 group cursor-pointer"
                onClick={() => setSelected(s)}
              >
                <div className="flex-1 p-2 bg-surface-container/50 border border-outline-variant/30 rounded text-[10px] font-mono text-tertiary break-all hover:border-[#ff5c00]/40 hover:text-[#ffb59a] transition-colors">
                  /{s.title.toLowerCase().replace(/\s+/g, "_")}
                </div>
                <button
                  type="button"
                  onClick={(e) => handleRemove(e, s.id)}
                  disabled={pending}
                  className="opacity-0 group-hover:opacity-100 text-tertiary hover:text-red-400 transition shrink-0"
                >
                  <span className="material-symbols-outlined text-[12px]">remove</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-tertiary font-bold uppercase tracking-widest">
            Nenhuma tarefa ainda
          </p>
        )}
      </div>

      {selected && <PromptModal step={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

function DriveBox({
  campaignId,
  driveFiles,
}: {
  campaignId: string;
  driveFiles: Attachment[];
}) {
  const [pending, startTransition] = useTransition();

  function handleRemove(id: string) {
    startTransition(async () => {
      await removeAttachmentAction(id, campaignId);
    });
  }

  return (
    <div className="bg-[rgba(32,31,31,0.8)] border border-outline-variant/50 rounded-lg p-3 flex flex-col gap-3">
      <h3 className="text-xs font-semibold text-on-surface flex items-center gap-2">
        <span className="material-symbols-outlined text-tertiary text-[14px]">folder</span>
        Drive
      </h3>

      {driveFiles.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {driveFiles.map((a) => (
            <li key={a.id} className="flex items-center gap-2 group">
              <span className="material-symbols-outlined text-[12px] text-tertiary shrink-0">
                {a.type === "pdf"
                  ? "picture_as_pdf"
                  : a.type === "image"
                    ? "image"
                    : "description"}
              </span>
              <span className="flex-1 text-[10px] text-tertiary font-bold uppercase tracking-widest truncate">
                {a.path.split("/").pop()}
              </span>
              <button
                type="button"
                onClick={() => handleRemove(a.id)}
                disabled={pending}
                className="opacity-0 group-hover:opacity-100 text-tertiary hover:text-red-400 transition shrink-0"
              >
                <span className="material-symbols-outlined text-[12px]">remove</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[10px] text-tertiary font-bold uppercase tracking-widest">
          Nenhum arquivo
        </p>
      )}
    </div>
  );
}
