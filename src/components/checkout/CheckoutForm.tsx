'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { checkoutSchema, type CheckoutValues } from '@/lib/validators'
import { useCartStore } from '@/store/useCartStore'

export function CheckoutForm() {
  const router = useRouter()
  const clearCart = useCartStore((state) => state.clearCart)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      country: 'Vietnam',
    },
  })

  const onSubmit = handleSubmit(async () => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    clearCart()
    router.push('/checkout/success')
  })

  const inputClassName =
    'h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary'
  const labelClassName = 'mb-1.5 block text-sm font-medium text-foreground'
  const errorClassName = 'mt-1 text-xs text-destructive'

  return (
    <form onSubmit={onSubmit} className="rounded-[1.5rem] border border-border bg-card p-6 md:p-8">
      <div className="rounded-2xl border border-primary/25 bg-primary/8 px-4 py-3 text-sm text-foreground">
        <p className="font-medium text-foreground">Demo website warning</p>
        <p className="mt-1 text-muted-foreground">
          This is a demo checkout. No real payment will be processed and no order will be shipped.
        </p>
      </div>

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold tracking-[-0.03em] text-foreground">Contact</h2>
        <label className="mt-4 block">
          <span className={labelClassName}>Email</span>
          <input {...register('email')} type="email" className={inputClassName} />
          {errors.email ? <p className={errorClassName}>{errors.email.message}</p> : null}
        </label>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold tracking-[-0.03em] text-foreground">
          Shipping address
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="md:col-span-2">
            <span className={labelClassName}>Full name</span>
            <input {...register('fullName')} className={inputClassName} />
            {errors.fullName ? <p className={errorClassName}>{errors.fullName.message}</p> : null}
          </label>
          <label className="md:col-span-2">
            <span className={labelClassName}>Address</span>
            <input {...register('address')} className={inputClassName} />
            {errors.address ? <p className={errorClassName}>{errors.address.message}</p> : null}
          </label>
          <label>
            <span className={labelClassName}>City</span>
            <input {...register('city')} className={inputClassName} />
            {errors.city ? <p className={errorClassName}>{errors.city.message}</p> : null}
          </label>
          <label>
            <span className={labelClassName}>Postal code</span>
            <input {...register('postalCode')} className={inputClassName} />
            {errors.postalCode ? <p className={errorClassName}>{errors.postalCode.message}</p> : null}
          </label>
          <label className="md:col-span-2">
            <span className={labelClassName}>Country</span>
            <input {...register('country')} className={inputClassName} />
            {errors.country ? <p className={errorClassName}>{errors.country.message}</p> : null}
          </label>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold tracking-[-0.03em] text-foreground">Payment</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <label className="md:col-span-3">
            <span className={labelClassName}>Card number</span>
            <input {...register('cardNumber')} inputMode="numeric" className={inputClassName} />
            {errors.cardNumber ? <p className={errorClassName}>{errors.cardNumber.message}</p> : null}
          </label>
          <label className="md:col-span-2">
            <span className={labelClassName}>Expiry date</span>
            <input {...register('expiryDate')} placeholder="MM/YY" className={inputClassName} />
            {errors.expiryDate ? <p className={errorClassName}>{errors.expiryDate.message}</p> : null}
          </label>
          <label>
            <span className={labelClassName}>CVC</span>
            <input {...register('cvc')} inputMode="numeric" className={inputClassName} />
            {errors.cvc ? <p className={errorClassName}>{errors.cvc.message}</p> : null}
          </label>
        </div>
        <p className="mt-3 text-xs italic text-muted-foreground">
          Demo checkout — no real payment will be processed.
        </p>
      </section>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/50"
      >
        {isSubmitting ? 'Processing...' : 'Place Order'}
      </button>
    </form>
  )
}
