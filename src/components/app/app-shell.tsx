import { SidebarNav, SidebarUserCard } from "./sidebar";
import { MobileDrawer } from "./mobile-drawer";
import { UserMenu } from "./user-menu";
import { NotifBell, type ReminderAlert } from "./notif-bell";
import { SearchBar } from "./search-bar";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const in48h = new Date(Date.now() + 48 * 3600 * 1000).toISOString();

  const [adminFlag, { data: profile }, { data: billing }, { data: rawReminders }] = await Promise.all([
    isAdmin(),
    user
      ? supabase
          .from("users")
          .select("full_name, avatar_url")
          .eq("id", user.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    supabase.from("v_user_billing").select("*").maybeSingle(),
    user
      ? supabase
          .from("reminders")
          .select("id, message, trigger_at, campaigns(title)")
          .eq("status", "pending")
          .lte("trigger_at", in48h)
          .order("trigger_at", { ascending: true })
          .limit(10)
      : Promise.resolve({ data: null }),
  ]);

  const reminders: ReminderAlert[] = (rawReminders ?? []).map((r) => {
    const row = r as unknown as {
      id: string;
      message: string | null;
      trigger_at: string;
      campaigns: { title: string } | null;
    };
    return {
      id: row.id,
      message: row.message,
      trigger_at: row.trigger_at,
      campaign_title: row.campaigns?.title ?? null,
    };
  });

  const email = user?.email ?? "";
  const fullName = profile?.full_name ?? null;
  const avatarUrl = profile?.avatar_url ?? null;

  const { tierLabel, tierVariant } = resolveTier(billing);

  const userCard = user ? (
    <SidebarUserCard
      fullName={fullName}
      email={email}
      avatarUrl={avatarUrl}
      tierLabel={tierLabel}
      tierVariant={tierVariant}
    />
  ) : null;

  const initial = (fullName?.[0] ?? email[0] ?? "?").toUpperCase();

  return (
    <div className="flex h-screen w-screen overflow-hidden relative bg-surface-container-lowest">
      {/* Grid texture background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, #474746 1px, transparent 1px), linear-gradient(to bottom, #474746 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 flex-col border-r border-zinc-800/60 bg-zinc-950/80 backdrop-blur-[40px] z-50">
        <SidebarNav userSlot={userCard} showAdmin={adminFlag} />
      </aside>

      {/* Main workspace */}
      <div className="lg:ml-64 flex flex-col flex-1 h-full overflow-hidden relative z-10">
        {/* TopAppBar */}
        <header className="flex justify-between items-center w-full px-8 h-20 bg-zinc-950/70 backdrop-blur-2xl border-b border-zinc-800/50 shadow-[0_4px_30px_rgba(0,0,0,0.5)] z-40 shrink-0">
          {/* Mobile drawer */}
          <div className="lg:hidden mr-3">
            <MobileDrawer userSlot={userCard} showAdmin={adminFlag} />
          </div>

          {/* Search */}
          <SearchBar />

          {/* Trailing actions */}
          <div className="flex items-center gap-5">
            <NotifBell reminders={reminders} />
            {user ? (
              <UserMenu email={email} fullName={fullName} avatarUrl={avatarUrl} />
            ) : (
              <div className="h-8 w-8 rounded-full bg-[rgba(255,92,0,0.15)] border border-[#ff5c00]/30 flex items-center justify-center text-sm font-bold text-[#ffb59a]">
                {initial}
              </div>
            )}
          </div>
        </header>

        {/* Info banner */}
        <div
          className="shrink-0 flex items-start gap-4 px-8 py-3 border-b border-[rgba(233,195,73,0.15)]"
          style={{ background: "rgba(233,195,73,0.07)", borderTop: "1px solid rgba(233,195,73,0.1)" }}
        >
          <span className="material-symbols-outlined text-[18px] text-[#e9c349] shrink-0 mt-0.5">tips_and_updates</span>
          <div className="flex flex-col gap-1">
            <p className="text-[11px] text-[#e9c349]/90 leading-tight">
              <span className="font-bold text-[#e9c349]">Dica Workflow:</span>{" "}
              Ao criar uma campanha, preencha o campo <span className="font-bold text-[#e9c349]">Descrição</span> com etapas, links e instruções — isso vira seu Workflow pessoal para aquele protocolo.
            </p>
            <p className="text-[11px] text-[#e9c349]/70 leading-tight">
              <span className="font-bold text-[#e9c349]/90">Arquivo Pessoal:</span>{" "}
              Use o protocolo <span className="font-bold text-[#e9c349]/90">⭐ Arquivo Pessoal</span> para campanhas que não pertencem a nenhum protocolo específico — ideal para tracking de trades, metas e tarefas avulsas.
            </p>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar px-12 py-10">
          {children}
        </main>
      </div>
    </div>
  );
}


type Billing = {
  billing_status: "trialing" | "active" | "past_due" | "expired" | null;
  trial_days_left: number | null;
} | null;

function resolveTier(billing: Billing): {
  tierLabel: string;
  tierVariant: "trial" | "active" | "past_due" | "expired";
} {
  if (!billing || !billing.billing_status) {
    return { tierLabel: "Conta", tierVariant: "trial" };
  }
  if (billing.billing_status === "active") {
    return { tierLabel: "Premium", tierVariant: "active" };
  }
  if (billing.billing_status === "past_due") {
    return { tierLabel: "Pagamento pendente", tierVariant: "past_due" };
  }
  if (billing.billing_status === "expired") {
    return { tierLabel: "Trial expirado", tierVariant: "expired" };
  }
  const d = billing.trial_days_left ?? 0;
  return {
    tierLabel: `Trial · ${d} ${d === 1 ? "dia" : "dias"}`,
    tierVariant: "trial",
  };
}
