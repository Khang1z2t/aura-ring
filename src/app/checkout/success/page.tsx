import { FloatingActionMenu } from '@/components/common/FloatingActionMenu'
import { CheckoutSuccessState } from '@/components/checkout/CheckoutSuccessState'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'

export default function CheckoutSuccessPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background px-4 text-foreground md:px-8 lg:px-0">
        <CheckoutSuccessState />
      </main>
      <Footer />
      <FloatingActionMenu />
    </>
  )
}
