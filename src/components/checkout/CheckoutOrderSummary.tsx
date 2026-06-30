import Image from 'next/image'
import Link from 'next/link'

import { formatPrice } from '@/lib/utils'
import type { CartDisplayItem } from '@/types/cart'

interface CheckoutOrderSummaryProps {
  items: CartDisplayItem[]
}

export function CheckoutOrderSummary({ items }: CheckoutOrderSummaryProps) {
  const subtotal = items.reduce((total, item) => total + item.subtotal, 0)

  return (
    <aside className="rounded-xl border border-border bg-card p-6 lg:sticky lg:top-24">
      <div className="space-y-4">
        {items.map((item) => (
          <article
            key={item.key}
            className="flex items-center gap-3 border-b border-border pb-4 last:border-b-0 last:pb-0"
          >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-background">
              <Image
                src={item.image.src}
                alt={item.image.alt}
                fill
                className="object-contain p-1.5"
                sizes="48px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
              <p className="truncate text-xs text-muted-foreground">{item.detailLabel}</p>
            </div>
            <p className="text-sm tabular-nums text-foreground">{formatPrice(item.subtotal)}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="tabular-nums text-foreground">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium text-emerald-500">Free</span>
        </div>
        <div className="flex items-center justify-between pt-2 text-base">
          <span className="font-medium text-foreground">Total</span>
          <span className="tabular-nums text-foreground">{formatPrice(subtotal)}</span>
        </div>
      </div>

      <Link
        href="/cart"
        className="mt-4 block text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        Edit cart
      </Link>
    </aside>
  )
}
