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

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.origin),
  title: siteConfig.seo.title,
  description: siteConfig.seo.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    images: [
      { url: "/images/brand/og-placeholder.png", width: 1200, height: 630 },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    images: ["/images/brand/og-placeholder.png"],
  },
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
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
