import type { Product } from '@/types/product'

export const products: Product[] = [
  {
    id: 'air',
    slug: 'aura-air',
    name: 'Aura Air',
    tagline: 'The featherlight ring for daily recovery tracking.',
    price: 199,
    colors: [
      { name: 'Rose Titanium', hex: '#d4c5b0', imageIndex: 0 },
      { name: 'Soft Silver', hex: '#e0e0e8', imageIndex: 0 },
    ],
    images: [
      {
        src: '/images/rings/aura_ring_air.webp',
        alt: 'Aura Air smart ring in rose titanium',
        width: 960,
        height: 960,
      },
    ],
    features: ['Sleep score insights', 'Cycle-aware readiness', 'Comfort-first fit'],
    specs: {
      Battery: '7 days',
      Weight: '2.8g',
      Material: 'Rose titanium',
      Water: '100m',
    },
    inStock: true,
  },
  {
    id: 'pro',
    slug: 'aura-pro',
    name: 'Aura Pro',
    tagline: 'Balanced performance for training, focus, and rest.',
    price: 279,
    originalPrice: 319,
    badge: 'BESTSELLER',
    colors: [
      { name: 'Platinum Silver', hex: '#e0e0e8', imageIndex: 0 },
      { name: 'Matte Black', hex: '#3a3a4a', imageIndex: 0 },
    ],
    images: [
      {
        src: '/images/rings/aura_ring_pro.webp',
        alt: 'Aura Pro smart ring in platinum silver',
        width: 960,
        height: 960,
      },
    ],
    features: ['Live heart-rate trends', 'Stress windows', 'Workout recovery'],
    specs: {
      Battery: '8 days',
      Weight: '3.1g',
      Material: 'Platinum titanium',
      Water: '150m',
    },
    inStock: true,
  },
  {
    id: 'elite',
    slug: 'aura-elite',
    name: 'Aura Elite',
    tagline: 'A warm gold statement built for all-day biometrics.',
    price: 349,
    badge: 'NEW',
    colors: [
      { name: 'Champagne Titanium', hex: '#c8a96a', imageIndex: 0 },
      { name: 'Brushed Graphite', hex: '#3a3a4a', imageIndex: 0 },
    ],
    images: [
      {
        src: '/images/rings/aura_ring_elite.webp',
        alt: 'Aura Elite smart ring in champagne gold',
        width: 960,
        height: 960,
      },
    ],
    features: ['Deep sleep staging', 'Guided calm prompts', 'Luxury-grade finish'],
    specs: {
      Battery: '9 days',
      Weight: '3.3g',
      Material: 'Champagne titanium',
      Water: '150m',
    },
    inStock: true,
  },
  {
    id: 'obsidian',
    slug: 'aura-obsidian',
    name: 'Aura Obsidian',
    tagline: 'The stealth model for hard training and late nights.',
    price: 399,
    badge: 'LIMITED',
    colors: [{ name: 'Black', hex: '#3a3a4a', imageIndex: 0 }],
    images: [
      {
        src: '/images/rings/aura_ring_obsidian.webp',
        alt: 'Aura Obsidian smart ring in dark titanium',
        width: 960,
        height: 960,
      },
    ],
    features: ['Training load balance', 'Nighttime HRV focus', 'Dark titanium shell'],
    specs: {
      Battery: '8 days',
      Weight: '3.2g',
      Material: 'Dark titanium',
      Water: '150m',
    },
    inStock: true,
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug)
}

export function getAllSlugs(): string[] {
  return products.map((product) => product.slug)
}
