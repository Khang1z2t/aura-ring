import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

export function CartEmptyState() {
  return (
    <section className="flex flex-col items-center py-24 text-center">
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-card text-muted-foreground">
        <ShoppingBag className="h-12 w-12" />
      </span>
      <h1 className="mt-6 font-display text-xl font-semibold tracking-[-0.03em] text-foreground">
        Your cart is empty
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Looks like you haven&apos;t added a ring yet.
      </p>
      <Link
        href="/products"
        className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Shop Rings
      </Link>
    </section>
  )
}
