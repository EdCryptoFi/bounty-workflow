import type { Metadata } from "next";
import { LandingClient } from "./landing-client";
import { createClient } from "@/lib/supabase/server";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://bountywork.xyz";

export const metadata: Metadata = {
  title: "Bounty WorkFlow — Plataforma para Hunters de Bounty Cripto",
  description:
    "Nunca mais perca um bounty por prazo vencido. Organize protocolos, gerencie campanhas e receba alertas automáticos — feito para hunters sérios do Brasil.",
  alternates: { canonical: APP_URL },
  openGraph: {
    title: "Bounty WorkFlow — Organize seus bounties cripto",
    description:
      "Mais de 500 hunters organizando seus bounties. 40+ protocolos. Taxa de entrega de 87%. Comece grátis por 14 dias.",
    url: APP_URL,
    images: [{ url: "/logo-horizontal.png", width: 1200, height: 400, alt: "Bounty WorkFlow" }],
  },
};

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: protocols } = await supabase
    .from("protocols")
    .select("name, slug")
    .order("name");

  const protocolNames = protocols
    ?.map((p) => ((p.name as string) || (p.slug as string)).toUpperCase())
    .filter(Boolean) ?? [];

  return <LandingClient protocols={protocolNames.length > 0 ? protocolNames : undefined} />;
}
