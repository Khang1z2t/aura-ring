const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'http://localhost:3000'

export const siteConfig = {
  name: 'Aurora',
  brand: 'Aurora Ring',
  title: 'Aurora Ring | Smart Health Ring',
  description:
    'Aurora Ring is a premium smart ring for sleep, recovery, heart rate, stress, and daily health insights in a refined jewelry-first form.',
  url: siteUrl,
  ogImage: '/og-image.jpg',
  keywords: [
    'smart ring',
    'health ring',
    'sleep tracking ring',
    'recovery tracking',
    'heart rate ring',
    'Aurora Ring',
  ],
  nav: [
    { label: 'Features', href: '/#features' },
    { label: 'Products', href: '/products' },
    { label: 'Specs', href: '/#specs' },
    { label: 'Subscribe', href: '/#subscribe' },
  ],
} as const
