import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

import { siteConfig } from '@/config/site'

export function Navbar() {
  const cartCount = 0

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8 lg:px-0">
        <p className="font-display text-lg font-semibold tracking-tight">Aurora</p>
        <nav className="hidden items-center gap-6 lg:flex">
          {siteConfig.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Cart placeholder"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-card-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <ShoppingBag className="h-4 w-4" />
            {cartCount > 0 ? (
              <span className="absolute -top-1 -right-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground">
                {cartCount}
              </span>
            ) : null}
          </button>

          <Link
            href="/products"
            className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Buy now
          </Link>
        </div>
      </div>
    </header>
  )
}
