export type CartSizeMode = 'kit' | 'custom'

export interface CartItem {
  productId: string
  quantity: number
  selectedColor: string
  sizeMode: CartSizeMode
  selectedSize: string | null
}

export interface CartDisplayItem extends CartItem {
  key: string
  name: string
  slug: string
  image: {
    src: string
    alt: string
    width: number
    height: number
  }
  unitPrice: number
  subtotal: number
  detailLabel: string
}
