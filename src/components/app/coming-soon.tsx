import type { LucideIcon } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/ui";

/**
 * Placeholder usado pelas rotas que vão ser implementadas nos Commits 2/3
 * (Projetos, Performance, Timeline dedicada). Evita 404 e comunica status.
 */
export function ComingSoon({
  title,
  subtitle,
  icon,
  eta,
}: {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  eta?: string;
}) {
  const description = eta ? `${subtitle} · Em breve · ${eta}` : subtitle;

  return (
    <EmptyState
      icon={icon}
      title={title}
      description={description}
      action={{
        href: "/dashboard",
        label: "Voltar ao Dashboard",
        iconLeft: <ArrowLeft className="h-4 w-4" />,
      }}
    />
  );
}
