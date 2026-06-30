'use client'

import { FloatingActionMenu } from '@/components/common/FloatingActionMenu'
import { CartEmptyState } from '@/components/cart/CartEmptyState'
import { CartLineItem } from '@/components/cart/CartLineItem'
import { CartSummary } from '@/components/cart/CartSummary'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { getCartDisplayItems } from '@/lib/cart'
import { useCartStore } from '@/store/useCartStore'

export default function CartPage() {
  const items = useCartStore((state) => state.items)
  const lineItems = getCartDisplayItems(items)
  const totalItems = lineItems.reduce((total, item) => total + item.quantity, 0)
  const subtotal = lineItems.reduce((total, item) => total + item.subtotal, 0)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground">
        <section className="px-4 py-12 md:px-8 lg:px-0">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">Cart</p>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.03em] text-foreground">
              Your Cart
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </p>

            {lineItems.length === 0 ? (
              <CartEmptyState />
            ) : (
              <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
                <div>
                  {lineItems.map((item) => (
                    <CartLineItem key={item.key} item={item} />
                  ))}
                </div>
                <CartSummary
                  subtotal={subtotal}
                  totalItems={totalItems}
                  ctaHref="/checkout"
                  ctaLabel="Proceed to Checkout"
                  secondaryHref="/products"
                  secondaryLabel="Continue shopping"
                  sticky
                />
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <FloatingActionMenu />
    </>
  )
}
