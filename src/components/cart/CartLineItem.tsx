'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'

import { formatPrice, slugify } from '@/lib/utils'
import { useCartStore } from '@/store/useCartStore'
import type { CartDisplayItem } from '@/types/cart'

interface CartLineItemProps {
  item: CartDisplayItem
}

export function CartLineItem({ item }: CartLineItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const productHref = `/products/${item.slug}?color=${slugify(item.selectedColor)}`

  return (
    <article className="flex gap-4 border-b border-border py-5">
      <Link
        href={productHref}
        aria-label={`View ${item.name}`}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-card transition-opacity hover:opacity-85"
      >
        <Image
          src={item.image.src}
          alt={item.image.alt}
          fill
          className="object-contain p-2"
          sizes="80px"
        />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <Link href={productHref} className="min-w-0 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            <h2 className="text-base font-medium text-foreground transition-colors hover:text-primary">{item.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{item.detailLabel}</p>
            <p className="mt-2 text-sm tabular-nums text-foreground">{formatPrice(item.unitPrice)}</p>
          </Link>

          <p className="text-left text-lg tabular-nums text-foreground sm:text-right">
            {formatPrice(item.subtotal)}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center rounded-md border border-border">
            <button
              type="button"
              aria-label={`Decrease quantity for ${item.name}`}
              onClick={() => updateQuantity(item.key, item.quantity - 1)}
              className="inline-flex h-8 w-8 items-center justify-center transition-colors hover:bg-card"
            >
              −
            </button>
            <span className="min-w-8 px-2 text-center text-sm tabular-nums">{item.quantity}</span>
            <button
              type="button"
              aria-label={`Increase quantity for ${item.name}`}
              onClick={() => updateQuantity(item.key, item.quantity + 1)}
              className="inline-flex h-8 w-8 items-center justify-center transition-colors hover:bg-card"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={() => removeItem(item.key)}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </button>
        </div>
      </div>
    </article>
  )
}
