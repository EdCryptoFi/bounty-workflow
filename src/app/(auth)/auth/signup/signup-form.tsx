"use client";

import { useFormStatus, useFormState } from "react-dom";
import { signupAction, type SignupState } from "./actions";

export function SignupForm({ next, refCode }: { next: string; refCode?: string }) {
  const [state, action] = useFormState<SignupState, FormData>(signupAction, null);

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="next" value={next} />
      {refCode && <input type="hidden" name="ref" value={refCode} />}

      <GlassField
        id="full_name"
        type="text"
        label="Nome"
        placeholder="Como podemos te chamar?"
        icon="person"
      />
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
        placeholder="8+ caracteres, 1 maiúscula, 1 número"
        icon="lock"
        required
      />

      {state?.error && (
        <div className="rounded border border-red-900/40 bg-red-900/20 px-3 py-2 text-xs font-medium text-red-300">
          {state.error}
        </div>
      )}
      {state?.ok && (
        <div className="rounded border border-secondary/30 bg-secondary/10 px-3 py-2 text-xs font-medium text-secondary">
          {state.ok}
        </div>
      )}

      <SubmitButton />
    </form>
  );
}

function GlassField({
  id,
  type,
  label,
  placeholder,
  icon,
  required,
}: {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  icon: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-[10px] font-bold uppercase tracking-widest text-tertiary"
      >
        {label}
      </label>
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
          autoComplete={
            type === "password" ? "new-password" : id === "full_name" ? "name" : "email"
          }
          className="input-glass w-full pl-8 py-2 text-sm"
        />
      </div>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex items-center justify-center gap-2 py-3 bg-[#ff5c00] hover:bg-[#ff7b33] text-white text-xs font-bold uppercase tracking-widest rounded transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,92,0,0.4)] active:scale-95 disabled:opacity-60 mt-2"
    >
      {pending ? "Criando..." : (
        <>
          Criar conta
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </>
      )}
    </button>
  );
}
