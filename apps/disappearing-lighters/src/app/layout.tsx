import type { Metadata, Viewport } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Disappearing Lighters",
  description: "The fire remembers you.",
  openGraph: {
    title: "Disappearing Lighters",
    description: "The fire remembers you.",
    siteName: "Disappearing Lighters",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
