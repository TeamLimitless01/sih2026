import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cyber Forensics Platform",
  description: "AI-Powered Unified Cyber Fraud Analysis & Digital Artifact Correlator",
};

import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <Providers>
          {children}
          <Toaster theme="dark" />
        </Providers>
      </body>
    </html>
  );
}
