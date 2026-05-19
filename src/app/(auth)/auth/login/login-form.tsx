"use client";

import { useState } from "react";
import { useFormStatus, useFormState } from "react-dom";
import { loginAction, magicLinkAction, type LoginState } from "./actions";
import { GoogleButton } from "@/components/auth/google-button";
import { TwitterButton } from "@/components/auth/twitter-button";

export function LoginForm({ next }: { next: string }) {
  const [mode, setMode] = useState<"password" | "magic">("password");
  const [pwState, pwAction] = useFormState<LoginState, FormData>(loginAction, null);
  const [magicState, magicAction] = useFormState<LoginState, FormData>(
    magicLinkAction,
    null,
  );

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

      <div className="text-center">
        <button
          type="button"
          onClick={() => setMode(mode === "password" ? "magic" : "password")}
          className="text-[10px] font-bold uppercase tracking-widest text-tertiary hover:text-[#ffb59a] transition-colors"
        >
          {mode === "password" ? "Usar magic link →" : "← Usar senha"}
        </button>
      </div>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-outline-variant/20" />
        </div>
        <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
          <span className="bg-[#181715] px-3 text-tertiary">Ou continue com</span>
        </div>
      </div>

      <div className="flex gap-3">
        <GoogleButton />
        <TwitterButton />
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
