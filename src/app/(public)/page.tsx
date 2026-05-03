import { headers } from "next/headers";
import { LandingClient } from "./landing-client";

export default async function LandingPage() {
  const hdrs = await headers();
  const acceptLang = hdrs.get("accept-language") ?? "";
  const defaultLang: "pt" | "en" = acceptLang.toLowerCase().startsWith("pt") ? "pt" : "en";

  return <LandingClient defaultLang={defaultLang} />;
}
