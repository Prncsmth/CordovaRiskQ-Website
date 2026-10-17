import type { Metadata, Viewport } from "next";
import { Archivo_Black, Inter, Sora } from "next/font/google";
import { SITE, getSiteUrl } from "@/lib/site";
import "./globals.css";

// Same typefaces as the mobile app: Sora for display text, Archivo Black for the wordmark.
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

// Inter for body text, navigation and labels.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: SITE.title,
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "CORDOVA RISKQ",
    "Cordova Cebu",
    "emergency app",
    "SOS",
    "incident reporting",
    "evacuation centers",
    "Android APK",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    locale: "en_PH",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} ${archivoBlack.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
