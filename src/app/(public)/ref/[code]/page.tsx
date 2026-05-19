import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";

export default async function ReferralRedirectPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const supabase = createAdminClient();

  // Find the user with this referral code
  const { data: referrer } = await supabase
    .from("users")
    .select("id")
    .eq("referral_code", code.toUpperCase())
    .maybeSingle();

  if (referrer) {
    // Record the click
    await supabase.from("referral_clicks").insert({
      referrer_id: referrer.id,
    });
  }

  // Redirect to signup with ref param
  const signupUrl = new URL("/auth/signup", process.env.NEXT_PUBLIC_APP_URL ?? "https://bountywork.xyz");
  signupUrl.searchParams.set("ref", code.toUpperCase());
  redirect(signupUrl.toString());
}
