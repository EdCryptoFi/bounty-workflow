/**
 * TypeScript port of X Algo/x-algorithm/integracao.py
 * Rule-based scoring from the Phoenix algorithm (May 2026 release).
 * Zero network calls — instant, works without any API key.
 */

export type Grade = "A" | "B" | "C" | "D" | "F";
export type IssueSeverity = "error" | "warning" | "info";

export interface Issue {
  severity: IssueSeverity;
  message: string;
  impact: string;
}

export interface AnalysisHighlights {
  hasLinks: boolean;
  linksInBody: boolean;
  isThread: boolean;
  hashtags: number;
  isRT: boolean;
  hasVideo: boolean;
  emojiCount: number;
}

export interface AnalysisResult {
  score: number;
  grade: Grade;
  issues: Issue[];
  suggestions: string[];
  highlights: AnalysisHighlights;
}

function extractLinks(text: string): string[] {
  return Array.from(text.matchAll(/https?:\/\/[^\s]+/g), (m) => m[0]);
}

function countNonEmptyLines(text: string): number {
  return text.split("\n").filter((l) => l.trim().length > 0).length;
}

function countHashtags(text: string): number {
  return (text.match(/#\w+/g) ?? []).length;
}

function countEmojis(text: string): number {
  return (text.match(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu) ?? []).length;
}

function toGrade(score: number): Grade {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  if (score >= 40) return "D";
  return "F";
}

export function analyzePost(content: string): AnalysisResult {
  const issues: Issue[] = [];
  const suggestions: string[] = [];
  let score = 60; // base 50 + 10 bonus (from integracao.py)

  const links = extractLinks(content);
  const firstLine = content.split("\n")[0] ?? content;
  const linksInBody = links.length > 0 && links.some((l) => firstLine.includes(l));

  // Rule 1: Links in main post body (-20 pts)
  if (linksInBody) {
    issues.push({
      severity: "error",
      message: "Link no post principal",
      impact: "-20 pts — não-Premium perde todo o alcance (mar/26)",
    });
    score -= 20;
    suggestions.push("Mova o link para uma reply após publicar");
  }

  // Rule 2: Thread detection (+15 pts)
  const lineCount = countNonEmptyLines(content);
  const isThread = lineCount >= 3;
  if (isThread) {
    score += 15;
    suggestions.push("✅ Thread detectada — alcance dobrado pelo algoritmo");
  }

  // Rule 3: Retweet penalty (-10 pts)
  const isRT = content.trimStart().toUpperCase().startsWith("RT ");
  if (isRT) {
    issues.push({
      severity: "error",
      message: "Retweet detectado",
      impact: "-10 pts — o algoritmo favorece conteúdo original",
    });
    score -= 10;
    suggestions.push("Crie conteúdo original em vez de retweetar");
  }

  // Rule 4: Hashtags
  const hashtagCount = countHashtags(content);
  if (hashtagCount > 4) {
    const excess = hashtagCount - 4;
    issues.push({
      severity: "warning",
      message: `${hashtagCount} hashtags — reduza para máx 4`,
      impact: `-${excess * 5} pts por excesso`,
    });
    score -= excess * 5;
  } else if (hashtagCount >= 1) {
    score += 5;
    suggestions.push("✅ Uso de hashtags dentro do limite recomendado");
  }

  // Rule 5: Emojis (relevant for crypto/bounty content)
  const emojiCount = countEmojis(content);
  if (emojiCount === 0 && !isRT) {
    issues.push({
      severity: "info",
      message: "Sem emojis",
      impact: "Emojis estratégicos aumentam engajamento em conteúdo cripto",
    });
    score -= 5;
    suggestions.push("Adicione 1-3 emojis relevantes para destacar pontos-chave");
  }

  // Rule 6: Video mention (info only, no score change — handled by platform)
  const hasVideo =
    content.toLowerCase().includes("vídeo") ||
    content.toLowerCase().includes("video") ||
    content.toLowerCase().includes("🎥") ||
    content.toLowerCase().includes("▶️");

  if (hasVideo) {
    suggestions.push("✅ Vídeo detectado — prioridade máxima de alcance no algoritmo");
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    grade: toGrade(Math.max(0, Math.min(100, score))),
    issues,
    suggestions: suggestions.filter((s) => !s.startsWith("✅") || issues.length === 0 ? true : true),
    highlights: {
      hasLinks: links.length > 0,
      linksInBody,
      isThread,
      hashtags: hashtagCount,
      isRT,
      hasVideo,
      emojiCount,
    },
  };
}
