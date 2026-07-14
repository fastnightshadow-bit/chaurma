import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { siteConfig } from "@/data/siteConfig";
import "./globals.css";

const manrope = localFont({
  src: [
    { path: "./fonts/manrope-cyrillic.woff2", weight: "400 800" },
    { path: "./fonts/manrope-latin.woff2", weight: "400 800" },
  ],
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

const socialImageUrl = `${siteConfig.origin}/images/brand/og-shawarma-no1.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.origin),
  applicationName: siteConfig.name,
  title: siteConfig.seo.title,
  description: siteConfig.seo.description,
  alternates: {
    canonical: siteConfig.origin,
    languages: { "ru-RU": siteConfig.origin },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: siteConfig.origin,
    siteName: siteConfig.name,
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    images: [
      {
        url: socialImageUrl,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — свежая горячая шаурма в Ярославле`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    images: [socialImageUrl],
  },
  icons: {
    icon: `${siteConfig.origin}/icons/icon.svg`,
    apple: `${siteConfig.origin}/icons/brand-icon-photo.png`,
  },
  manifest: `${siteConfig.origin}/manifest.webmanifest`,
};

export const viewport: Viewport = {
  themeColor: "#191815",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ru">
      <body className={manrope.className}>{children}</body>
    </html>
  );
}
