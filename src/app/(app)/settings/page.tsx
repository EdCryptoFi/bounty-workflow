import Link from "next/link";
import { CreditCard, User2 } from "lucide-react";
import { PageHeader } from "@/components/ui";

export default function SettingsPage() {
  const items = [
    {
      href: "/settings/billing",
      title: "Billing",
      desc: "Plano atual, trial e método de pagamento.",
      icon: CreditCard,
    },
    {
      href: "/settings/account",
      title: "Conta",
      desc: "Nome, email e preferências.",
      icon: User2,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Configurações da sua conta." />

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition hover:border-mint-400"
          >
            <div className="rounded-lg bg-mint-50 p-2 text-mint-700 group-hover:bg-mint-100">
              <it.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="font-medium">{it.title}</div>
              <div className="text-xs text-muted-foreground">{it.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
