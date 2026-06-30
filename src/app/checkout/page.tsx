'use client'

import { FloatingActionMenu } from '@/components/common/FloatingActionMenu'
import { CheckoutForm } from '@/components/checkout/CheckoutForm'
import { CheckoutOrderSummary } from '@/components/checkout/CheckoutOrderSummary'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { getCartDisplayItems } from '@/lib/cart'
import { useCartStore } from '@/store/useCartStore'

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items)
  const lineItems = getCartDisplayItems(items)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground">
        <section className="px-4 py-12 md:px-8 lg:px-0">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_400px]">
            <CheckoutForm />
            <CheckoutOrderSummary items={lineItems} />
          </div>
        </section>
      </main>
      <Footer />
      <FloatingActionMenu />
    </>
  )
}
