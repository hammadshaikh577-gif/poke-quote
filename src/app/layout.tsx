import type { Metadata, Viewport } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const pressStart = Press_Start_2P({
  variable: "--font-press-start",
  weight: "400",
  subsets: ["latin"],
});

const vt323 = VT323({
  variable: "--font-vt323",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "POKE.QUOTE — Gotta catch a quote!",
  description:
    "A retro, Pokémon-inspired random quote mini-game. Pick a mystery Poké Ball, meet a Pokémon and translate its wisdom.",
  icons: { icon: "/assets/pokeball/pokeball.svg" },
};

export const viewport: Viewport = {
  themeColor: "#d8341c",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${pressStart.variable} ${vt323.variable} h-full`}>
      <body className="crt min-h-full flex flex-col font-sans">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
