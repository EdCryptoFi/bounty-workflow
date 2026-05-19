import type { Metadata } from "next";
import { PreLancamentoClient } from "./pre-lancamento-client";
import { getWaitlistCount } from "@/lib/waitlist/actions";

export const metadata: Metadata = {
  title: "Lista de Espera — Bounty WorkFlow",
  description:
    "Entre na lista de espera do Bounty WorkFlow. Seja o primeiro a saber quando lançarmos.",
  alternates: { canonical: "/pre-lancamento" },
};

export default async function PreLancamentoPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const count = await getWaitlistCount();
  return <PreLancamentoClient initialCount={count} refCode={ref} />;
}
