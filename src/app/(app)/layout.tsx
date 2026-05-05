import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app/app-shell";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await requireUser();

  // Check if trial expired — redirect to /subscribe unless already there
  const hdrs = await headers();
  const pathname = hdrs.get("x-pathname") ?? "";
  const isSubscribePage = pathname === "/subscribe";

  if (!isSubscribePage) {
    const supabase = await createClient();
    const { data: billing } = await supabase
      .from("v_user_billing")
      .select("derived_status")
      .maybeSingle();
    if (billing?.derived_status === "expired") {
      redirect("/subscribe");
    }
  }

  return <AppShell>{children}</AppShell>;
}
