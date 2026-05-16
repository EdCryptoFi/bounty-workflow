import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, tooManyRequests } from "@/lib/rate-limit";
import { analyzePost } from "@/lib/x-algo/analyzer";
import { rewritePost } from "@/lib/x-algo/rewriter";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const limit = rateLimit(`x-analyzer:${user.id}`, 20, 60 * 60_000);
  if (!limit.ok) return tooManyRequests(limit.retryAfterMs);

  let body: { content?: unknown; requestRewrite?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido" }, { status: 400 });
  }

  const content = typeof body.content === "string" ? body.content.trim() : "";
  if (!content || content.length < 10) {
    return NextResponse.json({ error: "Post muito curto" }, { status: 400 });
  }
  if (content.length > 4000) {
    return NextResponse.json({ error: "Post muito longo (máx 4000 chars)" }, { status: 400 });
  }

  const analysis = analyzePost(content);

  if (!body.requestRewrite) {
    return NextResponse.json({ analysis, optimized: null });
  }

  const keys = {
    groq: process.env.GROQ_API_KEY,
    gemini: process.env.GEMINI_API_KEY,
    mistral: process.env.MISTRAL_API_KEY,
  };

  const hasAnyKey = Object.values(keys).some(Boolean);
  if (!hasAnyKey) {
    return NextResponse.json(
      { analysis, optimized: null, error: "Rewrite indisponível — configure as chaves de IA" },
      { status: 503 },
    );
  }

  try {
    const { optimized, provider } = await rewritePost(content, analysis, keys);
    return NextResponse.json({ analysis, optimized, provider });
  } catch {
    return NextResponse.json(
      { analysis, optimized: null, error: "Falha ao gerar versão otimizada" },
      { status: 503 },
    );
  }
}
