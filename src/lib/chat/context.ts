import { products } from '@/data/products'
import { formatPrice, slugify } from '@/lib/utils'
import type { ChatLink, ChatTurn } from '@/types/chat'

export interface ChatCatalogProduct {
  name: string
  slug: string
  price: string
  colors: string[]
  sizesInStock: string[]
  specs: Record<string, string>
  tagline: string
}

export interface ChatCatalogContext {
  summary: string
  products: ChatCatalogProduct[]
  links: ChatLink[]
}

function buildProductLink(slug: string): ChatLink {
  return {
    label: `View ${products.find((product) => product.slug === slug)?.name ?? slug}`,
    href: `/products/${slug}`,
  }
}

function buildColorLink(productSlug: string, colorName: string): ChatLink {
  return {
    label: `Open ${colorName}`,
    href: `/products/${productSlug}?color=${slugify(colorName)}`,
  }
}

function buildSearchText(message: string, history: ChatTurn[]) {
  const recentUserHistory = history
    .filter((turn) => turn.role === 'user')
    .slice(-3)
    .map((turn) => turn.content)
    .join(' ')

  return `${recentUserHistory} ${message}`.toLowerCase()
}

export function buildChatCatalogContext(input: { message: string; history: ChatTurn[] }): ChatCatalogContext {
  const normalized = buildSearchText(input.message, input.history)
  const matched = products.filter((product) => {
    if (normalized.includes(product.slug)) return true
    if (normalized.includes(product.name.toLowerCase())) return true
    return product.colors.some((color) => normalized.includes(color.name.toLowerCase()))
  })

  const selected = matched.length > 0 ? matched : products

  const catalogProducts = selected.map((product) => ({
    name: product.name,
    slug: product.slug,
    price: formatPrice(product.price),
    colors: product.colors.map((color) => color.name),
    sizesInStock: product.sizes.filter((size) => size.inStock).map((size) => size.value),
    specs: product.specs,
    tagline: product.tagline,
  }))

  const links = selected
    .flatMap((product) => {
      const result: ChatLink[] = [buildProductLink(product.slug)]
      const matchingColor = product.colors.find((color) => normalized.includes(color.name.toLowerCase()))

      if (matchingColor) {
        result.push(buildColorLink(product.slug, matchingColor.name))
      }

      return result
    })
    .slice(0, 3)

  const summary = catalogProducts
    .map(
      (product) =>
        `${product.name}: ${product.price}; colors ${product.colors.join(', ')}; sizes ${product.sizesInStock.join(', ')}; tagline ${product.tagline}`
    )
    .join('\n')

  return { summary, products: catalogProducts, links }
}
