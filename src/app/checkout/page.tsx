import type { Metadata } from 'next'

import { CheckoutPageClient } from '@/app/checkout/CheckoutPageClient'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete demo checkout for Aurora Ring and review shipping and payment details.',
  alternates: {
    canonical: '/checkout',
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Checkout | Aurora Ring',
    description: 'Complete demo checkout for Aurora Ring and review shipping and payment details.',
    url: '/checkout',
    siteName: siteConfig.brand,
    images: [siteConfig.ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Checkout | Aurora Ring',
    description: 'Complete demo checkout for Aurora Ring and review shipping and payment details.',
    images: [siteConfig.ogImage],
  },
}

export default function CheckoutPage() {
  return <CheckoutPageClient />
}
