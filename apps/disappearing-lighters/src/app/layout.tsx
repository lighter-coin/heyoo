import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: '$LIGHTER — Disappearing Lighters',
  description: 'Bu çakmağı buldun. Ama o seni mi buldu?',
}

export const viewport: Viewport = {
  themeColor: '#060A14',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" className={`${playfair.variable} ${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-void text-light font-body min-h-dvh overflow-hidden">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
