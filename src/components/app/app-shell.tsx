import { SidebarNav, SidebarUserCard } from "./sidebar";
import { MobileDrawer } from "./mobile-drawer";
import { UserMenu } from "./user-menu";
import { createClient } from "@/lib/supabase/server";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: billing }] = await Promise.all([
    user
      ? supabase
          .from("users")
          .select("full_name, avatar_url")
          .eq("id", user.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    supabase.from("v_user_billing").select("*").maybeSingle(),
  ]);

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
        <SidebarNav userSlot={userCard} />
      </aside>

      {/* Main workspace */}
      <div className="lg:ml-64 flex flex-col flex-1 h-full overflow-hidden relative z-10">
        {/* TopAppBar */}
        <header className="flex justify-between items-center w-full px-8 h-20 bg-zinc-950/70 backdrop-blur-2xl border-b border-zinc-800/50 shadow-[0_4px_30px_rgba(0,0,0,0.5)] z-40 shrink-0">
          {/* Mobile drawer */}
          <div className="lg:hidden mr-3">
            <MobileDrawer userSlot={userCard} />
          </div>

          {/* Search */}
          <SearchBarInline />

          {/* Trailing actions */}
          <div className="flex items-center gap-5">
            <NotifBellInline />
            <button className="text-zinc-400 hover:text-[#ffb59a] transition-colors active:scale-95">
              <span className="material-symbols-outlined text-[24px]">apps</span>
            </button>
            {user ? (
              <UserMenu email={email} fullName={fullName} avatarUrl={avatarUrl} />
            ) : (
              <div className="h-8 w-8 rounded-full bg-[rgba(255,92,0,0.15)] border border-[#ff5c00]/30 flex items-center justify-center text-sm font-bold text-[#ffb59a]">
                {initial}
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar px-12 py-10">
          {children}
        </main>
      </div>
    </div>
  );
}

function SearchBarInline() {
  return (
    <div className="flex items-center w-96">
      <div className="relative w-full group">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-tertiary text-[20px] group-focus-within:text-[#ffb59a] transition-colors">
          search
        </span>
        <input
          className="w-full bg-transparent border-0 border-b border-secondary/30 pl-10 pr-4 py-2 text-on-surface focus:ring-0 focus:border-[#ff5c00] focus:outline-none text-sm placeholder:text-tertiary/50 transition-all"
          placeholder="Pesquisar operações..."
          type="search"
        />
        <div className="absolute bottom-0 left-0 h-[1px] w-full bg-[#ffb59a] opacity-0 group-focus-within:opacity-100 group-focus-within:shadow-[0_0_10px_rgba(255,92,0,0.5)] transition-all" />
      </div>
    </div>
  );
}

function NotifBellInline() {
  return (
    <button className="relative text-zinc-400 hover:text-[#ffb59a] transition-colors active:scale-95">
      <span className="material-symbols-outlined text-[24px]">notifications</span>
      <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#ffb59a] shadow-[0_0_8px_rgba(255,92,0,0.8)]" />
    </button>
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
