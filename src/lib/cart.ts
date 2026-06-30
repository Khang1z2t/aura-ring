import { products } from '@/data/products'
import type { CartDisplayItem, CartItem } from '@/types/cart'

export function buildCartItemKey(item: CartItem) {
  return [item.productId, item.selectedColor, item.sizeMode, item.selectedSize ?? 'kit'].join('::')
}

export function getCartDisplayItems(items: CartItem[]): CartDisplayItem[] {
  return items.flatMap((item) => {
    const product = products.find((entry) => entry.id === item.productId)

    if (!product) {
      return []
    }

    const image = product.images[0]
    const sizeLabel = item.sizeMode === 'kit' ? 'Free sizing kit' : `Size ${item.selectedSize}`

    return [
      {
        ...item,
        key: buildCartItemKey(item),
        name: product.name,
        slug: product.slug,
        image,
        unitPrice: product.price,
        subtotal: product.price * item.quantity,
        detailLabel: `${item.selectedColor} · ${sizeLabel}`,
      },
    ]
  })
}

export function getCartItemCount(items: CartItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0)
}

export function getCartSubtotal(items: CartItem[]) {
  return getCartDisplayItems(items).reduce((total, item) => total + item.subtotal, 0)
}
