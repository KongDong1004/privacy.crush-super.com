import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using a nice font like Inter or similar
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://privacy.crush-super.com"),
  title: {
    default: "Privacy Pixel - Secure Browser-based Redaction",
    template: "%s | Privacy Pixel"
  },
  description: "Redact sensitive information from images securely in your browser. No server uploads. Free, fast, and private mosaic & blur tool.",
  keywords: ["image redaction", "privacy", "blur image", "mosaic image", "browser-based", "secure", "local processing", "hide face", "censor image"],
  authors: [{ name: "Privacy Pixel Team" }],
  creator: "Privacy Pixel",
  publisher: "Crush Super",
  openGraph: {
    title: "Privacy Pixel - Secure Browser-based Redaction",
    description: "Securely blur or mosaic sensitive parts of your images directly in your browser. No data is ever sent to a server.",
    type: "website",
    url: "https://privacy.crush-super.com",
    siteName: "Privacy Pixel",
    locale: "en_US",
    images: [
      {
        url: "/og-image.jpg", // We will need to create this or placeholder
        width: 1200,
        height: 630,
        alt: "Privacy Pixel Interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Pixel - Secure Browser-based Redaction",
    description: "Redact sensitive information from images securely in your browser. No server uploads.",
    // images: ["/og-image.jpg"], 
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://privacy.crush-super.com",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "min-h-screen bg-background font-sans antialiased")}>
        {children}
      </body>
    </html>
  );
}
