"use client";

import { useRef, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Attachment } from "@/lib/types";
import { saveCloudAttachmentAction } from "@/lib/campaigns/actions";
import { CloudPickerButtons } from "./cloud-picker-buttons";

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "application/pdf",
]);

/**
 * AttachmentDropzone — A3 fix: valida MIME + size, path prefixado por user_id
 * (o bucket tem policy que exige (storage.foldername(name))[1] = auth.uid()::text).
 */
export function AttachmentDropzone({
  campaignId,
  userId,
  initial,
}: {
  campaignId: string;
  userId: string;
  initial: Attachment[];
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<Attachment[]>(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [dragging, setDragging] = useState(false);

  async function handleFiles(files: FileList | File[]) {
    setError(null);
    const file = Array.from(files)[0];
    if (!file) return;

    if (!ALLOWED.has(file.type)) {
      setError("Tipo não permitido. Use PNG, JPG, WEBP, GIF ou PDF.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("Arquivo maior que 10 MB.");
      return;
    }

    startTransition(async () => {
      const supabase = createClient();
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${userId}/${campaignId}/${Date.now()}_${safeName}`;

      const { error: upErr } = await supabase.storage
        .from("attachments")
        .upload(path, file, {
          contentType: file.type,
          upsert: false,
        });

      if (upErr) {
        setError(upErr.message);
        return;
      }

      const type: Attachment["type"] = file.type.startsWith("image/")
        ? "image"
        : file.type === "application/pdf"
          ? "pdf"
          : "other";

      const { data, error: insErr } = await supabase
        .from("attachments")
        .insert({
          campaign_id: campaignId,
          user_id: userId,
          bucket: "attachments",
          path,
          mime_type: file.type,
          size_bytes: file.size,
          type,
        })
        .select("*")
        .single();

      if (insErr || !data) {
        setError(insErr?.message ?? "Erro ao salvar anexo");
        return;
      }
      setItems((prev) => [data as Attachment, ...prev]);
    });
  }

  async function remove(att: Attachment) {
    setError(null);
    startTransition(async () => {
      const supabase = createClient();
      await supabase.storage.from(att.bucket).remove([att.path]);
      await supabase.from("attachments").delete().eq("id", att.id);
      setItems((prev) => prev.filter((a) => a.id !== att.id));
    });
  }

  return (
    <div>
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center text-center py-8 rounded-lg border-2 border-dashed transition-all cursor-pointer group ${
          dragging
            ? "border-[#e9c349]/60 bg-surface-container-high/30"
            : "border-outline-variant/50 hover:border-[#e9c349]/50 hover:bg-surface-container-high/20"
        }`}
        onClick={() => inputRef.current?.click()}
      >
        <div className="w-12 h-12 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center mb-3 group-hover:border-[#e9c349]/50 group-hover:shadow-[0_0_15px_rgba(233,195,73,0.15)] transition-all">
          <span className="material-symbols-outlined text-[#e9c349] group-hover:text-[#ffb59a] transition-colors">
            upload_file
          </span>
        </div>
        <p className="text-sm font-semibold text-on-surface mb-1">
          Arrastar Arquivos
        </p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
          PDF, PNG, JPG, WEBP · até 10 MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,application/pdf"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {/* Cloud pickers */}
      <div className="mt-3 flex items-center gap-3">
        <div className="flex-1 border-t border-outline-variant/30" />
        <span className="text-[9px] font-bold uppercase tracking-widest text-tertiary shrink-0">
          ou importe da nuvem
        </span>
        <div className="flex-1 border-t border-outline-variant/30" />
      </div>
      <div className="mt-2 flex justify-center">
        <CloudPickerButtons
          onFile={(url, name, source) => {
            startTransition(async () => {
              setError(null);
              const res = await saveCloudAttachmentAction(campaignId, url, name, source);
              if (res.error) {
                setError(res.error);
              } else if (res.data) {
                setItems((prev) => [res.data!, ...prev]);
              }
            });
          }}
        />
      </div>

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      {pending && (
        <p className="mt-2 text-xs text-tertiary font-bold uppercase tracking-widest">
          Enviando...
        </p>
      )}

      {items.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2">
          {items.map((a) => (
            <li
              key={a.id}
              className="flex items-center gap-3 rounded-lg border border-outline-variant/30 bg-surface-container/50 px-3 py-2"
            >
              <span className="material-symbols-outlined text-[16px] text-tertiary">
                {a.type === "pdf" ? "picture_as_pdf" : a.type === "image" ? "image" : "attach_file"}
              </span>
              <span className="flex-1 truncate text-xs text-on-surface">
                {a.path.split("/").pop()}
              </span>
              <span className="text-[10px] text-tertiary font-bold uppercase tracking-widest">
                {a.size_bytes ? `${Math.round(a.size_bytes / 1024)} KB` : ""}
              </span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); remove(a); }}
                className="rounded p-1 text-tertiary hover:text-red-400 transition-colors"
                aria-label="Remover"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
