import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export function CheckoutSuccessState() {
  const orderRef = 'DEMO-240630'

  return (
    <section className="mx-auto max-w-md py-24 text-center">
      <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
        <CheckCircle2 className="h-14 w-14" />
      </span>
      <h1 className="mt-6 font-display text-2xl font-semibold tracking-[-0.03em] text-foreground">
        Order Confirmed
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This is a demo order — no payment was charged. A confirmation would normally be sent to your email.
      </p>
      <p className="mt-4 text-sm tabular-nums text-muted-foreground">Order #{orderRef}</p>
      <Link
        href="/"
        className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Continue Shopping
      </Link>
    </section>
  )
}
