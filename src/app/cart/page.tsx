import type { Metadata } from 'next'

import { CartPageClient } from '@/app/cart/CartPageClient'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Your Cart',
  description: 'Review selected Aurora Ring items, sizes, and finishes before checkout.',
  alternates: {
    canonical: '/cart',
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Your Cart | Aurora Ring',
    description: 'Review selected Aurora Ring items, sizes, and finishes before checkout.',
    url: '/cart',
    siteName: siteConfig.brand,
    images: [siteConfig.ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Cart | Aurora Ring',
    description: 'Review selected Aurora Ring items, sizes, and finishes before checkout.',
    images: [siteConfig.ogImage],
  },
}

export default function CartPage() {
  return <CartPageClient />
}
