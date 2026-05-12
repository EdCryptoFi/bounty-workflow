import type { Metadata } from "next";
import { headers } from "next/headers";
import { LandingClient } from "./landing-client";

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
  const hdrs = await headers();
  const acceptLang = hdrs.get("accept-language") ?? "";
  const defaultLang: "pt" | "en" = acceptLang.toLowerCase().startsWith("pt") ? "pt" : "en";

  return <LandingClient defaultLang={defaultLang} />;
}
