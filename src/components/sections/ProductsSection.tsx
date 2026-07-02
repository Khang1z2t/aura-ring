import Link from 'next/link'

import { ProgressiveImage } from '@/components/common/ProgressiveImage'
import { Reveal } from '@/components/common/Reveal'
import { RevealGroup } from '@/components/common/RevealGroup'
import { products } from '@/data/products'

export function ProductsSection() {
  return (
    <section id="products" className="px-4 py-20 md:px-8 md:py-28 lg:px-0 lg:py-36">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">Products</p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.03em] text-balance md:text-4xl">
              Four finishes. One sensor core.
            </h2>
            <p className="mt-3 max-w-[34ch] text-base leading-7 text-muted-foreground">
              Pick mood, not feature checklist.
            </p>
          </div>

          <p className="max-w-sm text-sm leading-6 text-muted-foreground lg:text-right">
            Rose titanium, platinum silver, champagne gold, obsidian black.
          </p>
        </Reveal>

        <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {products.map((product, index) => (
            <Reveal key={product.id} variant="stagger-item" delay={0.05 * index}>
              <article className="group flex h-full flex-col rounded-[1.75rem] bg-card/55 p-5 ring-1 ring-white/6 transition duration-200 hover:bg-card/80">
                <div className="relative overflow-hidden rounded-[1.4rem] bg-surface">
                  {product.badge ? (
                    <span className="absolute top-3 left-3 z-10 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
                      {product.badge}
                    </span>
                  ) : null}
                  <ProgressiveImage
                    src={product.images[0].src}
                    alt={product.images[0].alt}
                    width={product.images[0].width}
                    height={product.images[0].height}
                    priority={index === 0}
                    className="aspect-square w-full object-contain p-6 transition duration-200 group-hover:scale-[1.03]"
                  />
                </div>

                <div className="mt-5 flex flex-1 flex-col">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    {product.colors[0].name}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{product.tagline}</p>

                  <div className="mt-5 flex items-end justify-between gap-3">
                    <div className="flex min-h-14 flex-col justify-end">
                      {product.originalPrice ? (
                        <p className="text-sm text-muted-foreground line-through">
                          ${product.originalPrice}
                        </p>
                      ) : (
                        <span className="h-[20px]" aria-hidden="true" />
                      )}
                      <p className="font-mono text-2xl text-foreground">${product.price}</p>
                    </div>
                    <Link
                      href={`/products/${product.slug}`}
                      className="inline-flex h-10 items-center justify-center rounded-full border border-border-strong px-4 text-sm font-medium text-foreground transition duration-150 hover:border-primary hover:text-primary"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
