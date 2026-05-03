/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from "next";
import "react-notion-x/src/styles.css";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "Agent Skills",
    template: "%s | Agent Skills"
  },
  description:
    "体系化整理 AI 使用技巧，涵盖提示词工程、工作流自动化等，持续更新中。",
  openGraph: {
    title: "Agent Skills",
    description: "体系化整理 AI 使用技巧，持续更新中。",
    images: ["/og-default.png"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <Nav />
          {children}
          <Footer />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
