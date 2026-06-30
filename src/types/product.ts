export interface ProductImage {
  src: string
  alt: string
  width: number
  height: number
}

export interface RingColor {
  name: string
  hex: string
  imageIndex: number
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
  features: string[]
  specs: Record<string, string>
  inStock: boolean
}
