import Image from 'next/image'
import Link from 'next/link'

import { products } from '@/data/products'

export function ProductsSection() {
  return (
    <section id="products" className="px-4 py-20 md:px-8 md:py-28 lg:px-0 lg:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">Products</p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.02em] md:text-4xl">
              Four finishes, one calm way to track your body.
            </h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Each ring keeps the same biometric core, then shifts the material story to match how
              you want it to feel on hand.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <span className="rounded-full border border-border px-3 py-1">Rose titanium</span>
            <span className="rounded-full border border-border px-3 py-1">Platinum silver</span>
            <span className="rounded-full border border-border px-3 py-1">Champagne gold</span>
            <span className="rounded-full border border-border px-3 py-1">Obsidian black</span>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {products.map((product) => (
            <article
              key={product.id}
              className="group rounded-3xl border border-border bg-card p-5 transition duration-200 hover:border-border-strong hover:bg-card-hover"
            >
              <div className="relative overflow-hidden rounded-2xl bg-surface">
                {product.badge ? (
                  <span className="absolute top-3 left-3 z-10 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
                    {product.badge}
                  </span>
                ) : null}
                <Image
                  src={product.images[0].src}
                  alt={product.images[0].alt}
                  width={product.images[0].width}
                  height={product.images[0].height}
                  className="aspect-square w-full object-contain p-6 transition duration-200 group-hover:scale-[1.03]"
                />
              </div>

              <div className="mt-5">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  {product.colors[0].name}
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground">
                  {product.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{product.tagline}</p>
              </div>

              <div className="mt-5 flex items-end justify-between gap-3">
                <div>
                  <p className="font-mono text-2xl text-foreground">${product.price}</p>
                  {product.originalPrice ? (
                    <p className="mt-1 text-sm text-muted-foreground line-through">
                      ${product.originalPrice}
                    </p>
                  ) : null}
                </div>
                <Link
                  href={`/products/${product.slug}`}
                  className="inline-flex h-10 items-center justify-center rounded-full border border-border-strong px-4 text-sm font-medium text-foreground transition duration-150 hover:border-primary hover:text-primary"
                >
                  View
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
