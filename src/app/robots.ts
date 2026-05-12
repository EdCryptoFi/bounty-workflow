import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://bountywork.xyz";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/como-funciona", "/legal/", "/auth/login", "/auth/signup"],
        disallow: [
          "/admin/",
          "/dashboard",
          "/campaigns/",
          "/reminders",
          "/archive",
          "/settings/",
          "/subscribe",
          "/referrals",
          "/protocols",
          "/dicas",
          "/api/",
          "/_next/",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
