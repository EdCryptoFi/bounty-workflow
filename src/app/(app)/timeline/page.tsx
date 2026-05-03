import { ListChecks } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { ComingSoon } from "@/components/app/coming-soon";

export const dynamic = "force-dynamic";

export default async function TimelineStandalonePage() {
  await requireUser();

  return (
    <ComingSoon
      icon={ListChecks}
      title="Timeline"
      subtitle="Visão cronológica completa de todas as campanhas e tarefas, com filtros e zoom. Hoje está dentro do Dashboard — vai ganhar página dedicada em breve."
      eta="Commit 2"
    />
  );
}
