import type { Metadata, Viewport } from "next";
import { Inter, PT_Sans } from "next/font/google";


import TanstackProvider from "@/components/providers/tanstack-query-provider";
import "@/assets/globals.css";
import { Toaster } from "@/components/ui/sonner";
import AppContext from "@/components/contexts/app-context";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

const ptSans = PT_Sans({
  variable: "--font-ptSans-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "DeepSite | Build with AI ✨",
  description:
    "DeepSite is a web development tool that helps you build websites with AI, no code required. Let's deploy your website with DeepSite and enjoy the magic of AI.",
  openGraph: {
    title: "DeepSite | Build with AI ✨",
    description:
      "DeepSite is a web development tool that helps you build websites with AI, no code required. Let's deploy your website with DeepSite and enjoy the magic of AI.",
    url: "https://deepsite.hf.co",
    siteName: "DeepSite",
    images: [
      {
        url: "https://deepsite.hf.co/banner.png",
        width: 1200,
        height: 630,
        alt: "DeepSite Open Graph Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DeepSite | Build with AI ✨",
    description:
      "DeepSite is a web development tool that helps you build websites with AI, no code required. Let's deploy your website with DeepSite and enjoy the magic of AI.",
    images: ["https://deepsite.hf.co/banner.png"],
  },
  appleWebApp: {
    capable: true,
    title: "DeepSite",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script
        defer
        data-domain="deepsite.hf.co"
        src="https://plausible.io/js/script.js"
      ></Script>
      <body
        className={`${inter.variable} ${ptSans.variable} antialiased bg-black dark h-[100dvh] overflow-hidden`}
      >
        <Toaster richColors position="bottom-center" />
        <TanstackProvider>
          <AppContext>{children}</AppContext>
        </TanstackProvider>
      </body>
    </html>
  );
}
