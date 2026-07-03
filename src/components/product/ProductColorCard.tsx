'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

import { formatPrice, slugify } from '@/lib/utils'
import type { Product, RingColor } from '@/types/product'

interface ProductColorCardProps {
  product: Product
  color: RingColor
}

export function ProductColorCard({ product, color }: ProductColorCardProps) {
  const image = product.images[color.imageIndex] ?? product.images[0]
  const href = `/products/${product.slug}?color=${slugify(color.name)}`
  const finishLabel = color.shortName ?? color.name

  return (
    <Link
      href={href}
      data-track={`color-card-${slugify(color.name)}`}
      aria-label={`View ${product.name} in ${color.name}`}
      className="group block rounded-[2rem] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      <motion.article
        initial="rest"
        whileHover="hover"
        whileFocus="hover"
        animate="rest"
        className="relative overflow-hidden rounded-[2rem] border border-border bg-card/70 transition duration-200 hover:border-border-strong hover:bg-card-hover"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-4">
          {product.badge ? (
            <span className="rounded-full bg-background/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-primary backdrop-blur-sm">
              {product.badge}
            </span>
          ) : (
            <div />
          )}

          <span className="ml-auto inline-flex items-center gap-2 rounded-full bg-background/82 px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-foreground backdrop-blur-sm lg:hidden">
            <span
              className="block h-2.5 w-2.5 rounded-full border border-white/20"
              style={{ backgroundColor: color.hex }}
            />
            <span>{finishLabel}</span>
          </span>

          <motion.div
            variants={{ rest: { opacity: 0, y: -6 }, hover: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            className="ml-auto hidden items-center gap-2 rounded-full bg-background/82 px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-foreground backdrop-blur-sm lg:inline-flex"
          >
            <span
              className="block h-2.5 w-2.5 rounded-full border border-white/20"
              style={{ backgroundColor: color.hex }}
            />
            <span>{finishLabel}</span>
          </motion.div>
        </div>

        <div className="relative aspect-[1/1.08] overflow-hidden bg-surface">
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className="h-full w-full object-contain p-4 transition duration-300 group-hover:scale-[1.03]"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/88 via-background/18 to-transparent" />

          <div className="pointer-events-none absolute inset-0 hidden items-center justify-center p-6 lg:flex">
            <motion.span
              variants={{ rest: { opacity: 0, scale: 0.96 }, hover: { opacity: 1, scale: 1 } }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 bg-background/80 px-5 text-sm font-medium text-foreground"
            >
              View
            </motion.span>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 px-5 pb-5 lg:hidden">
            <div className="flex items-end justify-between gap-4">
              <p className="max-w-[70%] text-left text-sm font-medium uppercase tracking-[0.18em] text-foreground">
                {color.name}
              </p>
              <p className="shrink-0 text-right text-sm font-medium text-foreground">
                {formatPrice(product.price)}
              </p>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden px-5 pb-5 lg:block">
            <div className="relative min-h-6">
              <motion.p
                variants={{ rest: { left: '50%', x: '-50%' }, hover: { left: 0, x: 0 } }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-0 w-max max-w-[70%] text-left text-sm font-medium uppercase tracking-[0.18em] text-foreground"
              >
                {color.name}
              </motion.p>
              <motion.p
                variants={{ rest: { opacity: 0, x: 16, scale: 0.94 }, hover: { opacity: 1, x: 0, scale: 1 } }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1], delay: 0.04 }}
                className="absolute right-0 bottom-0 text-right text-sm font-medium text-foreground"
              >
                {formatPrice(product.price)}
              </motion.p>
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  )
}
