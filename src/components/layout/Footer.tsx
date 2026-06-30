import Link from 'next/link'

import { siteConfig } from '@/config/site'

export function Footer() {
  return (
    <footer className="border-t border-border px-4 py-10 md:px-8 lg:px-0">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-lg font-semibold tracking-tight text-foreground">Aurora</p>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Recovery-first smart ring design with warm materials, quiet data, and all-day wearability.
          </p>
        </div>

        <div className="flex flex-col gap-3 md:items-end">
          <nav className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {siteConfig.nav.map((item) => (
              <a key={item.href} href={item.href} className="transition-colors hover:text-foreground">
                {item.label}
              </a>
            ))}
            <Link href="/products" className="transition-colors hover:text-foreground">
              Shop all
            </Link>
          </nav>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Aurora Ring · Living organism direction
          </p>
        </div>
      </div>
    </footer>
  )
}
