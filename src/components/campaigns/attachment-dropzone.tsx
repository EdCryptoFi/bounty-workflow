"use client";

import { useRef, useState, useTransition } from "react";
import { Upload, X, FileIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Attachment } from "@/lib/types";

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
        className={`grid place-items-center rounded-2xl border-2 border-dashed p-6 text-center transition ${
          dragging ? "border-mint-500 bg-mint-50" : "border-border bg-muted/10"
        }`}
      >
        <Upload className="h-6 w-6 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          Arraste arquivos aqui ou{" "}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="font-medium text-mint-700 hover:underline"
          >
            selecione
          </button>
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          PNG, JPG, WEBP, GIF, PDF · até 10 MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,application/pdf"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {error && (
        <p className="mt-2 text-xs text-destructive">{error}</p>
      )}

      {pending && (
        <p className="mt-2 text-xs text-muted-foreground">Enviando...</p>
      )}

      {items.length > 0 && (
        <ul className="mt-4 space-y-2">
          {items.map((a) => (
            <li
              key={a.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2"
            >
              <FileIcon className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 truncate text-sm">
                {a.path.split("/").pop()}
              </span>
              <span className="text-xs text-muted-foreground">
                {a.size_bytes ? `${Math.round(a.size_bytes / 1024)} KB` : ""}
              </span>
              <button
                type="button"
                onClick={() => remove(a)}
                className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-destructive"
                aria-label="Remover"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
