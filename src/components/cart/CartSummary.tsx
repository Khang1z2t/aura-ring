import Link from 'next/link'

import { formatPrice } from '@/lib/utils'

interface CartSummaryProps {
  subtotal: number
  totalItems: number
  ctaHref: string
  ctaLabel: string
  ctaDisabled?: boolean
  secondaryHref: string
  secondaryLabel: string
  sticky?: boolean
}

export function CartSummary({
  subtotal,
  totalItems,
  ctaHref,
  ctaLabel,
  ctaDisabled = false,
  secondaryHref,
  secondaryLabel,
  sticky = false,
}: CartSummaryProps) {
  return (
    <aside className={sticky ? 'lg:sticky lg:top-24' : undefined}>
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between py-2 text-sm">
          <span className="text-muted-foreground">Items</span>
          <span className="tabular-nums text-foreground">{totalItems}</span>
        </div>
        <div className="flex items-center justify-between py-2 text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="tabular-nums text-foreground">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between py-2 text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium text-emerald-500">Free</span>
        </div>
        <div className="my-3 border-t border-border" />
        <div className="flex items-center justify-between py-2">
          <span className="text-lg font-medium text-foreground">Total</span>
          <span className="text-xl tabular-nums text-foreground">{formatPrice(subtotal)}</span>
        </div>

        {ctaDisabled ? (
          <span className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-primary/50 px-5 text-sm font-medium text-primary-foreground">
            {ctaLabel}
          </span>
        ) : (
          <Link
            href={ctaHref}
            className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {ctaLabel}
          </Link>
        )}

        <Link
          href={secondaryHref}
          className="mt-3 block text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {secondaryLabel}
        </Link>
      </div>
    </aside>
  )
}
