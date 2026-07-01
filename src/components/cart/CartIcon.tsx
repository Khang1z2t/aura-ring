'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

import { useHydrated } from '@/hooks/useHydrated'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/store/useCartStore'

interface CartIconProps {
  mobile?: boolean
}

export function CartIcon({ mobile = false }: CartIconProps) {
  const hydrated = useHydrated()
  const count = useCartStore((state) => state.itemCount())

  return (
    <Link
      href="/cart"
      aria-label="Open cart"
      className={cn(
        'relative inline-flex items-center justify-center transition-colors hover:text-primary',
        mobile
          ? 'h-10 w-10 text-card-foreground'
          : 'h-10 w-10 rounded-xl border border-border bg-card text-card-foreground hover:border-primary'
      )}
    >
      <ShoppingBag className={mobile ? 'h-5 w-5' : 'h-4 w-4'} />
      {hydrated && count > 0 ? (
        <span
          className={cn(
            'absolute inline-flex items-center justify-center rounded-full bg-primary font-semibold leading-none text-primary-foreground',
            mobile
              ? 'top-1 right-1 min-h-4 min-w-4 px-1 text-[9px]'
              : '-top-1 -right-1 min-h-5 min-w-5 px-1 text-[10px]'
          )}
        >
          {count}
        </span>
      ) : null}
    </Link>
  )
}
