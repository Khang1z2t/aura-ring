export interface ProductImage {
  src: string
  alt: string
  width: number
  height: number
}

export interface RingColor {
  name: string
  shortName?: string
  hex: string
  imageIndex: number
}

export interface ProductFeature {
  icon: string
  title: string
  description: string
}

export interface ProductSize {
  value: string
  inStock: boolean
}

export interface Product {
  id: string
  slug: string
  name: string
  tagline: string
  price: number
  originalPrice?: number
  badge?: 'NEW' | 'BESTSELLER' | 'LIMITED'
  colors: RingColor[]
  images: ProductImage[]
  features: ProductFeature[]
  sizes: ProductSize[]
  specs: Record<string, string>
  inStock: boolean
}
