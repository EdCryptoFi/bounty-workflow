/**
 * AI-powered post rewriter using free providers.
 * Fallback chain: Groq → Gemini → Mistral
 * Only called when the user explicitly requests an optimized version.
 */

import type { AnalysisResult } from "./analyzer";

const SYSTEM_PROMPT = `Você é um especialista em crescimento orgânico no X (Twitter) com foco em conteúdo sobre criptomoedas e bounty hunting.

Regras críticas do algoritmo Phoenix (2026) que você deve aplicar:
- NUNCA coloque links no corpo do post — sempre indique "(link na reply)"
- Threads (3+ parágrafos separados) têm alcance dobrado
- Máximo 4 hashtags relevantes
- Use 1-3 emojis estratégicos para destacar pontos-chave
- Conteúdo original sempre supera retweets
- Vídeos têm prioridade máxima de alcance

Sua tarefa: reescrever o post mantendo o tom e a mensagem original do autor, corrigindo os problemas identificados e maximizando o score do algoritmo Phoenix.

Responda APENAS com o post reescrito, sem explicações, sem prefácio, sem aspas ao redor.`;

interface RewriteResult {
  optimized: string;
  provider: string;
}

async function tryGroq(content: string, analysisContext: string, apiKey: string): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Contexto da análise:\n${analysisContext}\n\nPost original:\n${content}`,
        },
      ],
      max_tokens: 600,
      temperature: 0.7,
    }),
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) throw new Error(`Groq ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}

async function tryGemini(content: string, analysisContext: string, apiKey: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `${SYSTEM_PROMPT}\n\nContexto da análise:\n${analysisContext}\n\nPost original:\n${content}`,
            },
          ],
        },
      ],
      generationConfig: { maxOutputTokens: 600, temperature: 0.7 },
    }),
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
}

async function tryMistral(content: string, analysisContext: string, apiKey: string): Promise<string> {
  const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "mistral-small-latest",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Contexto da análise:\n${analysisContext}\n\nPost original:\n${content}`,
        },
      ],
      max_tokens: 600,
      temperature: 0.7,
    }),
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) throw new Error(`Mistral ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}

function buildAnalysisContext(analysis: AnalysisResult): string {
  const lines: string[] = [`Score atual: ${analysis.score}/100 (${analysis.grade})`];

  if (analysis.issues.length > 0) {
    lines.push("\nProblemas identificados:");
    for (const issue of analysis.issues) {
      lines.push(`- ${issue.message}: ${issue.impact}`);
    }
  }

  const realSuggestions = analysis.suggestions.filter((s) => !s.startsWith("✅"));
  if (realSuggestions.length > 0) {
    lines.push("\nCorreções necessárias:");
    for (const s of realSuggestions) {
      lines.push(`- ${s}`);
    }
  }

  return lines.join("\n");
}

export async function rewritePost(
  content: string,
  analysis: AnalysisResult,
  keys: { groq?: string; gemini?: string; mistral?: string },
): Promise<RewriteResult> {
  const ctx = buildAnalysisContext(analysis);

  if (keys.groq) {
    try {
      const optimized = await tryGroq(content, ctx, keys.groq);
      if (optimized) return { optimized, provider: "Groq (Llama 3.3 70B)" };
    } catch {
      // fall through to next provider
    }
  }

  if (keys.gemini) {
    try {
      const optimized = await tryGemini(content, ctx, keys.gemini);
      if (optimized) return { optimized, provider: "Google Gemini 2.0 Flash" };
    } catch {
      // fall through to next provider
    }
  }

  if (keys.mistral) {
    try {
      const optimized = await tryMistral(content, ctx, keys.mistral);
      if (optimized) return { optimized, provider: "Mistral Small" };
    } catch {
      // fall through
    }
  }

  throw new Error("Nenhum provedor de IA disponível");
}
