"use client";

import { useState, useTransition, useRef } from "react";
import { updateProfileAction, updatePasswordAction, uploadAvatarAction } from "@/lib/settings/actions";

type Profile = {
  full_name: string | null;
  handle: string | null;
  avatar_url: string | null;
  email: string;
};

export function ProfilePanel({ profile }: { profile: Profile }) {
  const [profilePending, startProfile] = useTransition();
  const [profileMsg, setProfileMsg] = useState<{ ok: boolean; msg: string } | null>(null);
  const [pwPending, startPw] = useTransition();
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; msg: string } | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatar_url);
  const [avatarPending, startAvatar] = useTransition();
  const [avatarMsg, setAvatarMsg] = useState<{ ok: boolean; msg: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = (profile.full_name ?? profile.email)
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const referralCode = `BWF-${profile.email.split("@")[0].toUpperCase().slice(0, 8)}`;

  function handleProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setProfileMsg(null);
    const fd = new FormData(e.currentTarget);
    startProfile(async () => {
      const res = await updateProfileAction(fd);
      if (res?.error) setProfileMsg({ ok: false, msg: res.error });
      else setProfileMsg({ ok: true, msg: "Alterações salvas com sucesso." });
    });
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarMsg(null);
    const fd = new FormData();
    fd.append("avatar", file);
    startAvatar(async () => {
      const res = await uploadAvatarAction(fd);
      if (res?.error) setAvatarMsg({ ok: false, msg: res.error });
      else {
        setAvatarUrl(res.avatar_url ?? null);
        setAvatarMsg({ ok: true, msg: "Avatar atualizado." });
      }
    });
  }

  function handlePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPwMsg(null);
    const fd = new FormData(e.currentTarget);
    startPw(async () => {
      const res = await updatePasswordAction(fd);
      if (res?.error) setPwMsg({ ok: false, msg: res.error });
      else {
        setPwMsg({ ok: true, msg: "Senha atualizada com sucesso." });
        (e.target as HTMLFormElement).reset();
      }
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Profile Identity */}
      <div className="bg-[rgba(42,42,42,0.7)] backdrop-blur-xl border border-outline-variant/50 rounded-xl p-6 flex flex-col gap-5 shadow-[inset_0_0_20px_rgba(255,92,0,0.03)]">
        <h2 className="text-sm font-semibold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-[#e9c349] text-[16px]">person</span>
          Profile Identity
        </h2>

        {/* Avatar */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative group shrink-0"
            disabled={avatarPending}
          >
            {avatarUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover border-2 border-[#ff5c00]/40"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[rgba(255,92,0,0.12)] border-2 border-[#ff5c00]/40 flex items-center justify-center">
                <span className="text-xl font-bold text-[#ff5c00]">{initials}</span>
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-white text-[20px]">
                {avatarPending ? "hourglass_top" : "photo_camera"}
              </span>
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary truncate max-w-[180px]">
              {profile.email}
            </p>
            <p className="text-[9px] text-tertiary mt-0.5">
              JPG, PNG ou WebP · máx 2 MB
            </p>
            {avatarMsg && (
              <p className={`text-[10px] mt-1 font-bold ${avatarMsg.ok ? "text-[#e9c349]" : "text-red-400"}`}>
                {avatarMsg.msg}
              </p>
            )}
          </div>
        </div>

        <form onSubmit={handleProfile} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
              Nome do Operador
            </label>
            <input
              name="full_name"
              defaultValue={profile.full_name ?? ""}
              placeholder="Seu nome completo"
              className="rounded-lg border border-outline-variant/50 bg-surface-container/50 px-3 py-2 text-sm text-on-surface placeholder:text-tertiary outline-none transition focus:border-[#ff5c00]/60 focus:ring-1 focus:ring-[#ff5c00]/40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
              Handle / Setor
            </label>
            <input
              name="handle"
              defaultValue={profile.handle ?? ""}
              placeholder="@seu_handle"
              className="rounded-lg border border-outline-variant/50 bg-surface-container/50 px-3 py-2 text-sm text-on-surface placeholder:text-tertiary outline-none transition focus:border-[#ff5c00]/60 focus:ring-1 focus:ring-[#ff5c00]/40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
              Código de Referral
            </label>
            <div className="flex gap-2">
              <input
                readOnly
                value={referralCode}
                className="flex-1 rounded-lg border border-outline-variant/30 bg-surface-container/20 px-3 py-2 text-sm text-tertiary font-mono outline-none cursor-default select-all"
              />
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(referralCode)}
                title="Copiar código"
                className="rounded-lg border border-outline-variant/50 bg-surface-container/50 px-3 py-2 text-tertiary hover:text-[#ff5c00] transition"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
              </button>
            </div>
          </div>

          {profileMsg && (
            <p className={`text-xs ${profileMsg.ok ? "text-[#e9c349]" : "text-red-400"}`}>
              {profileMsg.msg}
            </p>
          )}

          <button
            type="submit"
            disabled={profilePending}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#ff5c00] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#ff7b33] hover:shadow-[0_0_15px_rgba(255,92,0,0.4)] disabled:opacity-60 active:scale-95"
          >
            {profilePending ? "Salvando..." : "Salvar Alterações"}
          </button>
        </form>
      </div>

      {/* Right column */}
      <div className="flex flex-col gap-6">
        {/* Interface */}
        <div className="bg-[rgba(42,42,42,0.7)] backdrop-blur-xl border border-outline-variant/50 rounded-xl p-6 flex flex-col gap-4 shadow-[inset_0_0_20px_rgba(255,92,0,0.03)]">
          <h2 className="text-sm font-semibold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-[#e9c349] text-[16px]">settings_applications</span>
            Interface
          </h2>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
                Idioma do Sistema
              </label>
              <select className="rounded-lg border border-outline-variant/50 bg-[rgba(22,22,22,0.8)] px-3 py-2 text-sm text-on-surface outline-none transition focus:border-[#ff5c00]/60 cursor-pointer">
                <option value="pt-BR">Português (PT-BR)</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 bg-surface-container/30 rounded-lg border border-outline-variant/20">
              <div>
                <p className="text-xs font-semibold text-on-surface">Tema do Sistema</p>
                <p className="text-[10px] text-tertiary mt-0.5 font-bold uppercase tracking-widest">
                  Escuro Ativo
                </p>
              </div>
              <div className="w-10 h-5 bg-[#ff5c00] rounded-full relative cursor-pointer shadow-[0_0_10px_rgba(255,92,0,0.4)]">
                <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow" />
              </div>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-[rgba(42,42,42,0.7)] backdrop-blur-xl border border-outline-variant/50 rounded-xl p-6 flex flex-col gap-4 shadow-[inset_0_0_20px_rgba(255,92,0,0.03)]">
          <h2 className="text-sm font-semibold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-[#e9c349] text-[16px]">security</span>
            Protocolos de Segurança
          </h2>

          <form onSubmit={handlePassword} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-tertiary">
                Nova Senha
              </label>
              <input
                name="new_password"
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                className="rounded-lg border border-outline-variant/50 bg-surface-container/50 px-3 py-2 text-sm text-on-surface placeholder:text-tertiary outline-none transition focus:border-[#ff5c00]/60 focus:ring-1 focus:ring-[#ff5c00]/40"
              />
            </div>

            {pwMsg && (
              <p className={`text-xs ${pwMsg.ok ? "text-[#e9c349]" : "text-red-400"}`}>
                {pwMsg.msg}
              </p>
            )}

            <button
              type="submit"
              disabled={pwPending}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#ff5c00]/40 bg-[#ff5c00]/10 px-4 py-2 text-sm font-bold text-[#ff5c00] transition hover:bg-[#ff5c00]/20 disabled:opacity-60"
            >
              {pwPending ? "Atualizando..." : "Atualizar Senha"}
            </button>
          </form>

          <div className="border-t border-outline-variant/30 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-on-surface">Two-Factor Authentication</p>
                <p className="text-[10px] text-tertiary mt-0.5 font-bold uppercase tracking-widest">
                  Proteção adicional
                </p>
              </div>
              <div className="w-10 h-5 bg-outline-variant/40 rounded-full relative cursor-pointer">
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-tertiary rounded-full shadow" />
              </div>
            </div>
            <div className="mt-3">
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-surface-container/50 border border-outline-variant/30">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-tertiary">
                  Status: Inativo
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
