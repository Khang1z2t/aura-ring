import type { Metadata } from 'next'

import { FloatingActionMenu } from '@/components/common/FloatingActionMenu'
import { CheckoutSuccessState } from '@/components/checkout/CheckoutSuccessState'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Order Confirmed',
  description: 'Aurora Ring demo checkout confirmation and next-step return to shopping.',
  alternates: {
    canonical: '/checkout/success',
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Order Confirmed | Aurora Ring',
    description: 'Aurora Ring demo checkout confirmation and next-step return to shopping.',
    url: '/checkout/success',
    siteName: siteConfig.brand,
    images: [siteConfig.ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Order Confirmed | Aurora Ring',
    description: 'Aurora Ring demo checkout confirmation and next-step return to shopping.',
    images: [siteConfig.ogImage],
  },
}

export default function CheckoutSuccessPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background px-4 text-foreground md:px-8 lg:px-0">
        <CheckoutSuccessState />
      </main>
      <Footer />
      <FloatingActionMenu />
    </>
  )
}
