import type { Metadata } from "next";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme/theme-provider";
import "./globals.css";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://bountywork.xyz";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-2FG5PZ279D";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Bounty WorkFlow — Plataforma para Hunters de Bounty Cripto",
    template: "%s · Bounty WorkFlow",
  },
  description:
    "Nunca mais perca um bounty por prazo vencido. Organize protocolos, gerencie campanhas e receba alertas automáticos — feito para hunters sérios do Brasil.",
  keywords: [
    "bounty crypto",
    "bounty hunter",
    "web3 bounty",
    "blockchain bounty",
    "crypto bounty brasil",
    "gerenciar campanhas bounty",
    "bounty workflow",
  ],
  authors: [{ name: "Bounty WorkFlow", url: APP_URL }],
  creator: "Bounty WorkFlow",
  publisher: "Bounty WorkFlow",
  openGraph: {
    title: "Bounty WorkFlow — Plataforma para Hunters de Bounty Cripto",
    description:
      "Organize protocolos, gerencie campanhas e receba alertas automáticos. Feito para hunters sérios do Brasil.",
    url: APP_URL,
    siteName: "Bounty WorkFlow",
    images: [
      {
        url: "/logo-horizontal.png",
        width: 1200,
        height: 400,
        alt: "Bounty WorkFlow — Plataforma para Hunters de Bounty Cripto",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bounty WorkFlow",
    description: "Organize seus bounties cripto. Nunca perca um deadline.",
    images: ["/logo-horizontal.png"],
    creator: "@bountyworkflow",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: APP_URL,
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  manifest: "/manifest.json",
  verification: {
    google: "kaLlUTwxxd16fAoIeLlYUtWjgH_v08k5DFJBF7PLS7M",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${APP_URL}/#website`,
      url: APP_URL,
      name: "Bounty WorkFlow",
      description:
        "Plataforma de gerenciamento de bounties cripto para hunters do Brasil.",
      inLanguage: "pt-BR",
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${APP_URL}/?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SoftwareApplication",
      name: "Bounty WorkFlow",
      url: APP_URL,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "Plataforma completa para hunters de bounty cripto: organize protocolos, gerencie campanhas e receba alertas de deadline.",
      inLanguage: ["pt-BR", "en"],
      offers: {
        "@type": "Offer",
        price: "29.90",
        priceCurrency: "BRL",
        priceValidUntil: "2027-12-31",
        availability: "https://schema.org/InStock",
      },
      featureList: [
        "Gerenciamento de campanhas",
        "Alertas de deadline",
        "Protocolos crypto integrados",
        "Sistema de referral",
        "Exportação CSV",
      ],
    },
    {
      "@type": "Organization",
      "@id": `${APP_URL}/#organization`,
      name: "Bounty WorkFlow",
      url: APP_URL,
      logo: {
        "@type": "ImageObject",
        url: `${APP_URL}/logo.png`,
        width: 512,
        height: 512,
      },
      contactPoint: {
        "@type": "ContactPoint",
        email: "suporte@bountyworkflow.com",
        contactType: "customer support",
        availableLanguage: ["Portuguese", "English"],
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=Space+Grotesk:wght@400;500;600;700&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#ff5c00" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', { page_path: window.location.pathname });
          `}
        </Script>
      </body>
    </html>
  );
}
