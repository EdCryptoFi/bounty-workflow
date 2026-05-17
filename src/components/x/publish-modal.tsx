"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import type { AnalysisResult, Grade } from "@/lib/x-algo/analyzer";

const GRADE_COLOR: Record<Grade, string> = {
  A: "#22c55e",
  B: "#86efac",
  C: "#ff5c00",
  D: "#f97316",
  F: "#ef4444",
};

interface XAccount {
  id: string;
  x_username: string;
  x_name: string | null;
  x_avatar_url: string | null;
}

type PublishModalProps = {
  isOpen: boolean;
  onClose: () => void;
  accounts: XAccount[];
  defaultText?: string;
};

export function PublishModal({
  isOpen,
  onClose,
  accounts,
  defaultText = "",
}: PublishModalProps) {
  const [text, setText] = useState(defaultText);
  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts[0]?.id ?? null,
  );
  const [result, setResult] = useState<{
    tweetId?: string;
    tweetUrl?: string;
    error?: string;
  } | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, startAnalyze] = useTransition();
  const [isPublishing, startPublish] = useTransition();
  const [isRewriting, startRewrite] = useTransition();
  const [copied, setCopied] = useState(false);

  const MAX = 280;
  const remaining = MAX - text.length;

  async function handleAnalyze() {
    if (text.trim().length < 10) return;
    startAnalyze(async () => {
      try {
        const res = await fetch("/api/ai/x-analyzer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: text }),
        });
        const data = await res.json();
        setAnalysis(data.analysis ?? null);
      } catch {
        setAnalysis(null);
      }
    });
  }

  async function handleRewrite() {
    if (text.trim().length < 10) return;
    startRewrite(async () => {
      try {
        const res = await fetch("/api/ai/x-analyzer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: text, requestRewrite: true }),
        });
        const data = await res.json();
        if (data.optimized) {
          setText(data.optimized);
          setAnalysis(data.analysis ?? null);
        }
      } catch {

      }
    });
  }

  async function handlePublish() {
    if (!selectedAccountId || text.trim().length < 2) return;
    startPublish(async () => {
      setResult(null);
      try {
        const res = await fetch("/api/x/publish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, accountId: selectedAccountId }),
        });
        const data = await res.json();
        if (data.tweet) {
          const selected = accounts.find((a) => a.id === selectedAccountId);
          setResult({
            tweetId: data.tweet.id,
            tweetUrl: `https://x.com/${selected?.x_username ?? "i"}/status/${data.tweet.id}`,
          });
        } else {
          setResult({ error: data.error ?? "Erro ao publicar" });
        }
      } catch {
        setResult({ error: "Erro de conexão" });
      }
    });
  }

  function handleClose() {
    setText(defaultText);
    setResult(null);
    setAnalysis(null);
    onClose();
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className="w-full max-w-lg rounded-2xl border p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
        style={{
          background: "rgba(24,23,23,0.98)",
          borderColor: "rgba(255,92,0,0.2)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: "rgba(255,92,0,0.1)",
                border: "1px solid rgba(255,92,0,0.2)",
              }}
            >
              <span className="material-symbols-outlined text-[20px]" style={{ color: "#ff5c00" }}>
                post_add
              </span>
            </div>
            <div>
              <h2 className="text-base font-semibold text-on-surface">Publicar no X</h2>
              <p className="text-[11px] text-tertiary">Composer com Bounty AI</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-tertiary">close</span>
          </button>
        </div>

        {accounts.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {accounts.map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => setSelectedAccountId(acc.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all",
                  selectedAccountId === acc.id
                    ? "text-[#ff5c00]"
                    : "text-tertiary hover:text-on-surface",
                )}
                style={{
                  background:
                    selectedAccountId === acc.id
                      ? "rgba(255,92,0,0.1)"
                      : "rgba(255,255,255,0.03)",
                  border:
                    selectedAccountId === acc.id
                      ? "1px solid rgba(255,92,0,0.3)"
                      : "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <span>@{acc.x_username}</span>
              </button>
            ))}
          </div>
        )}

        {accounts.length === 0 && (
          <p className="text-xs text-tertiary text-center py-2">
            Nenhuma conta X conectada.{" "}
            <a href="/settings" className="text-[#ff5c00] underline hover:no-underline">
              Conectar em Configurações
            </a>
          </p>
        )}

        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value.slice(0, MAX));
              setResult(null);
              setAnalysis(null);
            }}
            placeholder="Digite seu post..."
            rows={4}
            className="w-full resize-none rounded-xl p-4 text-sm text-on-surface placeholder:text-tertiary focus:outline-none focus:ring-1 focus:ring-[rgba(255,92,0,0.4)] transition-all"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          />
          <span
            className={cn(
              "absolute bottom-3 right-3 text-[10px] font-mono",
              remaining < 20 ? "text-[#ff5c00]" : "text-tertiary",
            )}
          >
            {text.length}/{MAX}
          </span>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzing || text.trim().length < 10 || isPublishing || accounts.length === 0}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-all",
              isAnalyzing || text.trim().length < 10 || isPublishing || accounts.length === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:opacity-90 active:scale-[0.98]",
            )}
            style={{
              background: "rgba(255,92,0,0.08)",
              color: "#ff5c00",
              border: "1px solid rgba(255,92,0,0.2)",
            }}
          >
            <span className="material-symbols-outlined text-[14px]">
              {isAnalyzing ? "hourglass_empty" : "analytics"}
            </span>
            {isAnalyzing ? "Analisando..." : "Analisar com Phoenix"}
          </button>

          <button
            type="button"
            onClick={handleRewrite}
            disabled={isRewriting || text.trim().length < 10 || isPublishing || accounts.length === 0}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-all",
              isRewriting || text.trim().length < 10 || isPublishing || accounts.length === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:opacity-90 active:scale-[0.98]",
            )}
            style={{
              background: "rgba(34,197,94,0.08)",
              color: "#22c55e",
              border: "1px solid rgba(34,197,94,0.2)",
            }}
          >
            <span className="material-symbols-outlined text-[14px]">
              {isRewriting ? "hourglass_empty" : "auto_fix_high"}
            </span>
            {isRewriting ? "Gerando..." : "✨ Otimizar com IA"}
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-all hover:opacity-80"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: copied ? "#22c55e" : "var(--color-tertiary)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span className="material-symbols-outlined text-[14px]">
              {copied ? "check" : "content_copy"}
            </span>
            {copied ? "Copiado!" : "Copiar"}
          </button>
        </div>

        {analysis && (
          <div
            className="flex flex-col gap-2 rounded-xl p-3"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
                Score Phoenix
              </span>
              <span className="text-lg font-bold tabular-nums" style={{ color: GRADE_COLOR[analysis.grade] }}>
                {analysis.score}
                <span className="text-xs text-tertiary ml-1">/100</span>
              </span>
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{
                  background: `${GRADE_COLOR[analysis.grade]}20`,
                  color: GRADE_COLOR[analysis.grade],
                  border: `1px solid ${GRADE_COLOR[analysis.grade]}40`,
                }}
              >
                {analysis.grade}
              </span>
            </div>
            {analysis.issues.length > 0 && (
              <div className="flex flex-col gap-1">
                {analysis.issues.map((issue, i) => (
                  <p key={i} className="text-[11px] text-tertiary flex items-start gap-1.5">
                    <span
                      style={{
                        color:
                          issue.severity === "error"
                            ? "#ef4444"
                            : issue.severity === "warning"
                              ? "#f97316"
                              : "#94a3b8",
                      }}
                    >
                      •
                    </span>
                    {issue.message}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {result && (
          <div
            className={cn(
              "flex items-start gap-2 rounded-xl p-3 text-sm",
              result.error ? "text-red-400" : "text-green-400",
            )}
            style={{
              background: result.error
                ? "rgba(239,68,68,0.08)"
                : "rgba(34,197,94,0.08)",
              border: result.error
                ? "1px solid rgba(239,68,68,0.2)"
                : "1px solid rgba(34,197,94,0.2)",
            }}
          >
            <span className="material-symbols-outlined text-[16px] shrink-0">
              {result.error ? "error" : "check_circle"}
            </span>
            <div>
              <p className="font-medium">{result.error ?? "Publicado com sucesso!"}</p>
              {result.tweetUrl && (
                <a
                  href={result.tweetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] underline hover:no-underline mt-0.5 inline-block"
                  style={{ color: "#22c55e" }}
                >
                  Ver tweet →
                </a>
              )}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handlePublish}
          disabled={isPublishing || text.trim().length < 2 || !selectedAccountId || accounts.length === 0}
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all",
            isPublishing || text.trim().length < 2 || !selectedAccountId || accounts.length === 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:opacity-90 active:scale-[0.98]",
          )}
          style={{ background: "#ff5c00", color: "#fff" }}
        >
          <span className="material-symbols-outlined text-[18px]">
            {isPublishing ? "hourglass_empty" : "post_add"}
          </span>
          {isPublishing ? "Publicando..." : "Publicar no X"}
        </button>
      </div>
    </div>
  );
}
