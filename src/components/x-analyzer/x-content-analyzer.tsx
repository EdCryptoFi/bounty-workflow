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

const GRADE_LABEL: Record<Grade, string> = {
  A: "Excelente",
  B: "Bom",
  C: "Razoável",
  D: "Fraco",
  F: "Crítico",
};

interface ApiResponse {
  analysis: AnalysisResult;
  optimized?: string | null;
  provider?: string;
  error?: string;
}

export function XContentAnalyzer({ initialContent = "" }: { initialContent?: string }) {
  const [content, setContent] = useState(initialContent);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isRewriting, startRewriteTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  const MAX = 4000;
  const remaining = MAX - content.length;

  function handleAnalyze() {
    if (content.trim().length < 10) return;
    startTransition(async () => {
      try {
        const res = await fetch("/api/ai/x-analyzer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });
        const data: ApiResponse = await res.json();
        setResult(data);
      } catch {
        setResult(null);
      }
    });
  }

  function handleRewrite() {
    if (!result) return;
    startRewriteTransition(async () => {
      try {
        const res = await fetch("/api/ai/x-analyzer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, requestRewrite: true }),
        });
        const data: ApiResponse = await res.json();
        setResult(data);
      } catch {
        // keep existing result
      }
    });
  }

  async function handleCopy() {
    if (!result?.optimized) return;
    await navigator.clipboard.writeText(result.optimized);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const analysis = result?.analysis;

  return (
    <div
      className="rounded-2xl border p-6 flex flex-col gap-5"
      style={{
        background: "rgba(24,23,23,0.95)",
        borderColor: "rgba(255,92,0,0.2)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "rgba(255,92,0,0.1)", border: "1px solid rgba(255,92,0,0.2)" }}
        >
          <span className="material-symbols-outlined text-[20px]" style={{ color: "#ff5c00" }}>
            bolt
          </span>
        </div>
        <div>
          <h2 className="text-base font-semibold text-on-surface">Bounty AI — Algoritmo do X</h2>
          <p className="text-[11px] text-tertiary">
            Baseado no algoritmo oficial Phoenix do X (xAI, maio 2026)
          </p>
        </div>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value.slice(0, MAX));
            setResult(null);
          }}
          placeholder="Cole ou escreva seu post aqui..."
          rows={5}
          className="w-full resize-none rounded-xl p-4 text-sm text-on-surface placeholder:text-tertiary focus:outline-none focus:ring-1 focus:ring-[rgba(255,92,0,0.4)] transition-all"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        />
        <span
          className={cn(
            "absolute bottom-3 right-3 text-[10px] font-mono",
            remaining < 200 ? "text-[#ff5c00]" : "text-tertiary",
          )}
        >
          {content.length}/{MAX}
        </span>
      </div>

      {/* Analyze button */}
      <button
        type="button"
        onClick={handleAnalyze}
        disabled={isPending || content.trim().length < 10}
        className={cn(
          "flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all",
          isPending || content.trim().length < 10
            ? "opacity-50 cursor-not-allowed"
            : "hover:opacity-90 active:scale-[0.98]",
        )}
        style={{ background: "#ff5c00", color: "#fff" }}
      >
        <span className="material-symbols-outlined text-[18px]">
          {isPending ? "hourglass_empty" : "analytics"}
        </span>
        {isPending ? "Analisando..." : "Analisar com Phoenix"}
      </button>

      {/* Results */}
      {analysis && (
        <div className="flex flex-col gap-4">
          {/* Score bar */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-tertiary">
                Score Phoenix
              </span>
              <div className="flex items-center gap-2">
                <span
                  className="text-2xl font-bold tabular-nums"
                  style={{ color: GRADE_COLOR[analysis.grade] }}
                >
                  {analysis.score}
                </span>
                <span className="text-sm text-tertiary">/100</span>
                <span
                  className="ml-1 text-[11px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: `${GRADE_COLOR[analysis.grade]}20`,
                    color: GRADE_COLOR[analysis.grade],
                    border: `1px solid ${GRADE_COLOR[analysis.grade]}40`,
                  }}
                >
                  {analysis.grade} — {GRADE_LABEL[analysis.grade]}
                </span>
              </div>
            </div>
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${analysis.score}%`,
                  background: GRADE_COLOR[analysis.grade],
                }}
              />
            </div>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              {
                label: "Thread",
                value: analysis.highlights.isThread ? "Sim (+15)" : "Não",
                ok: analysis.highlights.isThread,
              },
              {
                label: "Links no post",
                value: analysis.highlights.linksInBody ? "Sim (-20)" : "Não",
                ok: !analysis.highlights.linksInBody,
              },
              {
                label: "Hashtags",
                value: String(analysis.highlights.hashtags),
                ok: analysis.highlights.hashtags >= 1 && analysis.highlights.hashtags <= 4,
              },
              {
                label: "Vídeo",
                value: analysis.highlights.hasVideo ? "Detectado" : "Não",
                ok: analysis.highlights.hasVideo,
                neutral: !analysis.highlights.hasVideo,
              },
              {
                label: "Retweet",
                value: analysis.highlights.isRT ? "Sim (-10)" : "Não",
                ok: !analysis.highlights.isRT,
              },
              {
                label: "Emojis",
                value: String(analysis.highlights.emojiCount),
                ok: analysis.highlights.emojiCount > 0,
              },
            ].map((h) => (
              <div
                key={h.label}
                className="flex flex-col gap-0.5 rounded-lg px-3 py-2"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
                  {h.label}
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{
                    color: h.neutral
                      ? "var(--color-tertiary)"
                      : h.ok
                        ? "#22c55e"
                        : "#ef4444",
                  }}
                >
                  {h.value}
                </span>
              </div>
            ))}
          </div>

          {/* Issues */}
          {analysis.issues.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-tertiary">
                Problemas
              </span>
              {analysis.issues.map((issue, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 rounded-lg px-3 py-2.5"
                  style={{
                    background:
                      issue.severity === "error"
                        ? "rgba(239,68,68,0.08)"
                        : issue.severity === "warning"
                          ? "rgba(249,115,22,0.08)"
                          : "rgba(255,255,255,0.04)",
                    border: `1px solid ${issue.severity === "error" ? "rgba(239,68,68,0.2)" : issue.severity === "warning" ? "rgba(249,115,22,0.2)" : "rgba(255,255,255,0.06)"}`,
                  }}
                >
                  <span
                    className="material-symbols-outlined text-[16px] shrink-0 mt-0.5"
                    style={{
                      color:
                        issue.severity === "error"
                          ? "#ef4444"
                          : issue.severity === "warning"
                            ? "#f97316"
                            : "#94a3b8",
                    }}
                  >
                    {issue.severity === "error"
                      ? "error"
                      : issue.severity === "warning"
                        ? "warning"
                        : "info"}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-on-surface">{issue.message}</p>
                    <p className="text-[11px] text-tertiary mt-0.5">{issue.impact}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Suggestions */}
          {analysis.suggestions.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-tertiary">
                Sugestões
              </span>
              <div className="flex flex-col gap-1.5">
                {analysis.suggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-tertiary">
                    <span className="shrink-0 text-[#ff5c00]">•</span>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optimized version */}
          {result?.optimized ? (
            <div
              className="flex flex-col gap-3 rounded-xl p-4"
              style={{
                background: "rgba(34,197,94,0.05)",
                border: "1px solid rgba(34,197,94,0.2)",
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#22c55e" }}>
                  Versão otimizada
                  {result.provider && (
                    <span className="ml-2 font-normal text-tertiary normal-case">
                      via {result.provider}
                    </span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest transition-colors"
                  style={{ color: copied ? "#22c55e" : "#ff5c00" }}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {copied ? "check" : "content_copy"}
                  </span>
                  {copied ? "Copiado!" : "Copiar"}
                </button>
              </div>
              <p className="text-sm text-on-surface whitespace-pre-wrap leading-relaxed">
                {result.optimized}
              </p>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleRewrite}
              disabled={isRewriting}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all border",
                isRewriting ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 active:scale-[0.98]",
              )}
              style={{
                borderColor: "rgba(255,92,0,0.3)",
                color: "#ff5c00",
                background: "rgba(255,92,0,0.06)",
              }}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isRewriting ? "hourglass_empty" : "auto_fix_high"}
              </span>
              {isRewriting ? "Gerando versão otimizada..." : "✨ Gerar versão otimizada com IA"}
            </button>
          )}

          {result?.error && !result.optimized && (
            <p className="text-xs text-tertiary text-center">{result.error}</p>
          )}
        </div>
      )}
    </div>
  );
}
