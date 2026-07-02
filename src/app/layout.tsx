import type { Metadata } from 'next'
import { DM_Sans, JetBrains_Mono, Sora } from 'next/font/google'

import { PageTransition } from '@/components/common/PageTransition'
import { ThemeProvider } from '@/components/common/ThemeProvider'
import { siteConfig } from '@/config/site'

import './globals.css'

const themeInitScript = `
(() => {
  try {
    const stored = window.localStorage.getItem('aurora-theme')
    const theme = stored ? JSON.parse(stored)?.state?.theme : 'light'
    const isLight = theme === 'light'
    document.documentElement.classList.toggle('light', isLight)
    document.documentElement.style.colorScheme = isLight ? 'light' : 'dark'
  } catch {
    document.documentElement.classList.add('light')
    document.documentElement.style.colorScheme = 'light'
  }
})()
`


const sora = Sora({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body',
  display: 'swap',
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: '%s | Aurora Ring',
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: '/',
    siteName: siteConfig.brand,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sora.variable} ${dmSans.variable} ${jetBrainsMono.variable}`}
    >
      <body className="min-h-screen bg-background font-body text-foreground antialiased">
        <script>{themeInitScript}</script>
        <ThemeProvider>
          <PageTransition>{children}</PageTransition>
        </ThemeProvider>
      </body>
    </html>
  )
}
