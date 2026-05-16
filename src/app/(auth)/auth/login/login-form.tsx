"use client";

import { useState } from "react";
import { useFormStatus, useFormState } from "react-dom";
import { loginAction, magicLinkAction, type LoginState } from "./actions";
import { createClient } from "@/lib/supabase/client";

export function LoginForm({ next }: { next: string }) {
  const [mode, setMode] = useState<"password" | "magic">("password");
  const [pwState, pwAction] = useFormState<LoginState, FormData>(loginAction, null);
  const [magicState, magicAction] = useFormState<LoginState, FormData>(
    magicLinkAction,
    null,
  );

  async function handleTwitterLogin() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "twitter",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
  }

  return (
    <div className="space-y-6">
      {mode === "password" ? (
        <form action={pwAction} className="space-y-6">
          <input type="hidden" name="next" value={next} />

          <GlassField
            id="email"
            type="email"
            label="E-mail Corporativo"
            placeholder="nome@empresa.com"
            icon="mail"
            required
          />
          <GlassField
            id="password"
            type="password"
            label="Senha de Acesso"
            placeholder="••••••••"
            icon="lock"
            required
            extra={
              <button
                type="button"
                className="text-[10px] font-bold uppercase tracking-widest text-[#ffb59a] hover:text-[#ff5c00] transition-colors"
              >
                Esqueceu a senha?
              </button>
            }
          />

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 rounded border-outline-variant bg-surface-container text-[#ff5c00] focus:ring-[#ff5c00]/50 focus:ring-offset-0"
            />
            <label
              htmlFor="remember"
              className="text-[10px] font-bold uppercase tracking-widest text-tertiary cursor-pointer"
            >
              Lembrar desta estação
            </label>
          </div>

          {pwState?.error && <Alert variant="error">{pwState.error}</Alert>}

          <SubmitButton>
            Iniciar Protocolo
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </SubmitButton>
        </form>
      ) : (
        <form action={magicAction} className="space-y-6">
          <input type="hidden" name="next" value={next} />
          <GlassField
            id="email"
            type="email"
            label="E-mail Corporativo"
            placeholder="nome@empresa.com"
            icon="mail"
            required
          />
          {magicState?.error && <Alert variant="error">{magicState.error}</Alert>}
          {magicState?.ok && <Alert variant="ok">{magicState.ok}</Alert>}
          <SubmitButton>
            Enviar link mágico
            <span className="material-symbols-outlined text-[18px]">send</span>
          </SubmitButton>
        </form>
      )}

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">ou</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      {/* Twitter/X OAuth */}
      <button
        type="button"
        onClick={handleTwitterLogin}
        className="w-full flex items-center justify-center gap-3 py-3 rounded border border-zinc-700/60 bg-zinc-900/60 hover:bg-zinc-800/80 text-white text-xs font-bold uppercase tracking-widest transition-all duration-200 hover:border-zinc-600"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.261 5.635 5.903-5.635Zm-1.161 17.52h1.833L7.084 4.126H5.117Z" />
        </svg>
        Entrar com X (Twitter)
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setMode(mode === "password" ? "magic" : "password")}
          className="text-[10px] font-bold uppercase tracking-widest text-tertiary hover:text-[#ffb59a] transition-colors"
        >
          {mode === "password" ? "Usar magic link →" : "← Usar senha"}
        </button>
      </div>
    </div>
  );
}

function GlassField({
  id,
  type,
  label,
  placeholder,
  icon,
  required,
  extra,
}: {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  icon: string;
  required?: boolean;
  extra?: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label
          htmlFor={id}
          className="text-[10px] font-bold uppercase tracking-widest text-tertiary"
        >
          {label}
        </label>
        {extra}
      </div>
      <div className="relative">
        <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-tertiary text-[20px] pointer-events-none">
          {icon}
        </span>
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          required={required}
          autoComplete={type === "password" ? "current-password" : "email"}
          className="input-glass w-full pl-8 py-2 text-sm"
        />
      </div>
    </div>
  );
}

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex items-center justify-center gap-2 py-3 bg-[#ff5c00] hover:bg-[#ff7b33] text-white text-xs font-bold uppercase tracking-widest rounded transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,92,0,0.4)] active:scale-95 disabled:opacity-60 mt-2"
    >
      {pending ? "Aguarde..." : children}
    </button>
  );
}

function Alert({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: "error" | "ok";
}) {
  const classes =
    variant === "error"
      ? "border-red-900/40 bg-red-900/20 text-red-300"
      : "border-secondary/30 bg-secondary/10 text-secondary";
  return (
    <div className={`rounded border px-3 py-2 text-xs font-medium ${classes}`}>
      {children}
    </div>
  );
}
