/**
 * Referral code utilities.
 */

export function generateReferralCode(email: string): string {
  const prefix = email.split("@")[0]?.toUpperCase().slice(0, 6) ?? "USER";
  const suffix = crypto.randomUUID().slice(0, 4).toUpperCase();
  return `BWF-${prefix}${suffix}`;
}

export function formatReferralUrl(code: string): string {
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "https://bountywork.xyz";
  return `${origin}/ref/${code}`;
}
