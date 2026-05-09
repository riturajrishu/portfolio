import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScrolling from "@/components/ui/SmoothScrolling";
import { SoundProvider } from "@/lib/SoundContext";
import SoundWidget from "@/components/ui/SoundWidget";
import TerminalEasterEgg from "@/components/ui/TerminalEasterEgg";
import RouteTransitionLoader from "@/components/ui/RouteTransitionLoader";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#030014",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://rituraj.vercel.app"
  ),
  title: "Ritu Raj — Full Stack Developer | Portfolio",
  description:
    "Portfolio of Ritu Raj, a Full Stack Developer specializing in React, Next.js, Node.js, and modern web technologies. Building performant, accessible, and visually stunning applications.",
  keywords: [
    "Ritu Raj",
    "Full Stack Developer",
    "React",
    "Next.js",
    "Node.js",
    "Portfolio",
    "Web Developer",
  ],
  authors: [{ name: "Ritu Raj" }],
  openGraph: {
    title: "Ritu Raj — Full Stack Developer",
    description:
      "Building premium digital experiences with modern web technologies",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`} style={{ colorScheme: "dark" }}>
      <body className="antialiased bg-[#030014] text-[#f1f5f9] min-h-screen overflow-x-hidden">
        <SoundProvider>
          <TerminalEasterEgg />
          <SoundWidget />
          <RouteTransitionLoader />
          <SmoothScrolling>{children}</SmoothScrolling>
        </SoundProvider>
      </body>
    </html>
  );
}
