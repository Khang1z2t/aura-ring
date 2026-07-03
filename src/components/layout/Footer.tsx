import Link from 'next/link'

import { siteConfig } from '@/config/site'

export function Footer() {
  return (
    <footer className="border-t border-border px-4 py-10 md:px-8 lg:px-0">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-lg font-semibold tracking-tight text-foreground">Aurora</p>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Recovery-first smart ring design with warm materials, quiet data, and all-day wearability.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <nav className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {siteConfig.nav.map((item) => (
                <a key={item.href} href={item.href} data-track={`footer-${item.label.toLowerCase().replace(/\s+/g, '-')}`} className="transition-colors hover:text-foreground">
                  {item.label}
                </a>
              ))}
              <Link href="/products" data-track="footer-shop-all" className="transition-colors hover:text-foreground">
                Shop all
              </Link>
            </nav>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Aurora Ring · Living organism direction
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-border/70 pt-4">
          <div className="flex flex-col gap-3 text-xs leading-5 text-muted-foreground md:flex-row md:items-end md:justify-between md:gap-6">
            <p className="max-w-md md:max-w-none">
              © 2026 Aurora. Demo website only; no affiliation claimed with referenced product imagery or third-party
              brand assets, and some visuals are AI-generated.
            </p>
            <div className="space-y-1 md:text-right">
              <p className="text-sm">
                Design and built by{' '}
                <a
                  href="https://github.com/khang1z2t"
                  target="_blank"
                  rel="noreferrer"
                  data-track="footer-github"
                  className="font-medium text-foreground transition-colors hover:text-primary"
                >
                  @yunok
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
