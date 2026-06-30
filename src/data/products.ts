import type { Product } from '@/types/product'

export const products: Product[] = [
  {
    id: 'air',
    slug: 'aura-air',
    name: 'Aura Air',
    tagline: 'The featherlight ring for daily recovery tracking.',
    price: 199,
    colors: [
      { name: 'Rose Titanium', shortName: 'Rose', hex: '#d4c5b0', imageIndex: 0 },
      { name: 'Soft Silver', shortName: 'Soft', hex: '#e0e0e8', imageIndex: 0 },
      { name: 'Matte Black', shortName: 'Matte', hex: '#2a2a32', imageIndex: 0 },
      { name: 'Sage Green', shortName: 'Sage', hex: '#8a9a85', imageIndex: 0 },
    ],
    images: [
      {
        src: '/images/rings/aura_ring_air.webp',
        alt: 'Aura Air smart ring in rose titanium',
        width: 960,
        height: 960,
      },
    ],
    features: [
      {
        icon: 'moon-star',
        title: 'Sleep score insights',
        description: 'Clear nightly scoring with trends that stay easy to read day after day.',
      },
      {
        icon: 'refresh-cw',
        title: 'Cycle-aware readiness',
        description: 'Recovery signals stay grounded in routine shifts so pacing decisions feel calmer.',
      },
      {
        icon: 'sparkles',
        title: 'Comfort-first fit',
        description: 'A lighter profile built to disappear on hand while still feeling polished.',
      },
    ],
    sizes: [
      { value: '6', inStock: true },
      { value: '7', inStock: true },
      { value: '8', inStock: true },
      { value: '9', inStock: true },
      { value: '10', inStock: true },
      { value: '11', inStock: true },
      { value: '12', inStock: false },
      { value: '13', inStock: false },
    ],
    specs: {
      Battery: '7 days',
      Weight: '2.8g',
      Material: 'Rose titanium',
      Water: '100m',
      Sensor: 'PPG, skin temperature, accelerometer',
      Compatibility: 'iOS 16+ / Android 10+',
      Connectivity: 'Bluetooth LE',
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
      { name: 'Platinum Silver', shortName: 'Platinum', hex: '#e0e0e8', imageIndex: 0 },
      { name: 'Matte Black', shortName: 'Matte', hex: '#3a3a4a', imageIndex: 0 },
    ],
    images: [
      {
        src: '/images/rings/aura_ring_pro.webp',
        alt: 'Aura Pro smart ring in platinum silver',
        width: 960,
        height: 960,
      },
    ],
    features: [
      {
        icon: 'activity',
        title: 'Live heart-rate trends',
        description: 'See pulse changes through training, focus blocks, and slower recovery windows.',
      },
      {
        icon: 'waves',
        title: 'Stress windows',
        description: 'Spot pressure patterns before they drag across the rest of your day.',
      },
      {
        icon: 'dumbbell',
        title: 'Workout recovery',
        description: 'Balance effort and reset with a model tuned for everyday performance use.',
      },
    ],
    sizes: [
      { value: '6', inStock: false },
      { value: '7', inStock: true },
      { value: '8', inStock: true },
      { value: '9', inStock: true },
      { value: '10', inStock: true },
      { value: '11', inStock: true },
      { value: '12', inStock: false },
      { value: '13', inStock: false },
    ],
    specs: {
      Battery: '8 days',
      Weight: '3.1g',
      Material: 'Platinum titanium',
      Water: '150m',
      Sensor: 'PPG, skin temperature, accelerometer',
      Compatibility: 'iOS 16+ / Android 10+',
      Connectivity: 'Bluetooth LE',
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
      { name: 'Champagne Titanium', shortName: 'Champagne', hex: '#c8a96a', imageIndex: 0 },
      { name: 'Brushed Graphite', shortName: 'Graphite', hex: '#3a3a4a', imageIndex: 0 },
    ],
    images: [
      {
        src: '/images/rings/aura_ring_elite.webp',
        alt: 'Aura Elite smart ring in champagne gold',
        width: 960,
        height: 960,
      },
    ],
    features: [
      {
        icon: 'moon-star',
        title: 'Deep sleep staging',
        description: 'Longer-range overnight patterns feel richer without turning into noisy dashboards.',
      },
      {
        icon: 'brain',
        title: 'Guided calm prompts',
        description: 'Short recovery nudges help slow the day down when your body starts to drift.',
      },
      {
        icon: 'gem',
        title: 'Luxury-grade finish',
        description: 'Warm metallic polish gives the ring a more jewelry-forward presence.',
      },
    ],
    sizes: [
      { value: '6', inStock: false },
      { value: '7', inStock: false },
      { value: '8', inStock: true },
      { value: '9', inStock: true },
      { value: '10', inStock: true },
      { value: '11', inStock: true },
      { value: '12', inStock: true },
      { value: '13', inStock: false },
    ],
    specs: {
      Battery: '9 days',
      Weight: '3.3g',
      Material: 'Champagne titanium',
      Water: '150m',
      Sensor: 'PPG, skin temperature, accelerometer',
      Compatibility: 'iOS 16+ / Android 10+',
      Connectivity: 'Bluetooth LE',
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
    colors: [{ name: 'Black', shortName: 'Black', hex: '#3a3a4a', imageIndex: 0 }],
    images: [
      {
        src: '/images/rings/aura_ring_obsidian.webp',
        alt: 'Aura Obsidian smart ring in dark titanium',
        width: 960,
        height: 960,
      },
    ],
    features: [
      {
        icon: 'dumbbell',
        title: 'Training load balance',
        description: 'A steadier read on when to push harder and when to let recovery catch up.',
      },
      {
        icon: 'moon-star',
        title: 'Nighttime HRV focus',
        description: 'Overnight recovery stays central for athletes watching fatigue closely.',
      },
      {
        icon: 'shield',
        title: 'Dark titanium shell',
        description: 'A stealth finish built to stay sharp through hard use and late nights.',
      },
    ],
    sizes: [
      { value: '6', inStock: false },
      { value: '7', inStock: false },
      { value: '8', inStock: true },
      { value: '9', inStock: true },
      { value: '10', inStock: true },
      { value: '11', inStock: false },
      { value: '12', inStock: false },
      { value: '13', inStock: false },
    ],
    specs: {
      Battery: '8 days',
      Weight: '3.2g',
      Material: 'Dark titanium',
      Water: '150m',
      Sensor: 'PPG, skin temperature, accelerometer',
      Compatibility: 'iOS 16+ / Android 10+',
      Connectivity: 'Bluetooth LE',
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
