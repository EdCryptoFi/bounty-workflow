"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Login via X (Twitter) usando OAuth do Supabase.
 * O provider "twitter" no Supabase corresponde à integração com X.
 *
 * IMPORTANTE: precisa estar ativado em:
 * Supabase → Authentication → Providers → Twitter
 * Com as credenciais obtidas em https://developer.x.com/en/portal/dashboard
 * Callback URL: https://<seu-projeto>.supabase.co/auth/v1/callback
 */
export function TwitterButton() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";

  async function signInWithTwitter() {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "twitter",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) {
      setLoading(false);
      alert(`Erro no X: ${error.message}`);
    }
  }

  return (
    <button
      type="button"
      onClick={signInWithTwitter}
      disabled={loading}
      className="luxury-glass flex items-center justify-center gap-2 py-2.5 rounded hover:glow-orange transition-all duration-300 group text-xs font-bold uppercase tracking-widest text-on-surface hover:text-[#ffb59a] border border-outline-variant/20 disabled:opacity-60"
    >
      {!loading && (
        <svg viewBox="0 0 1200 1227" className="h-3.5 w-3.5 fill-current shrink-0" aria-hidden>
          <path d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z" />
        </svg>
      )}
      {loading ? "Conectando..." : "X Login"}
    </button>
  );
}
