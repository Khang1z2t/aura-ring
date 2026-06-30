'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'

import { cn, formatPrice, slugify } from '@/lib/utils'
import type { Product } from '@/types/product'

interface ProductDetailPurchasePanelProps {
  product: Product
  initialColorSlug: string | null
}

export function ProductDetailPurchasePanel({
  product,
  initialColorSlug,
}: ProductDetailPurchasePanelProps) {
  const initialColor =
    product.colors.find((color) => slugify(color.name) === initialColorSlug) ?? product.colors[0]

  const [selectedColorName, setSelectedColorName] = useState(initialColor.name)
  const [sizeMode, setSizeMode] = useState<'kit' | 'custom'>('kit')
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  const selectedColor = useMemo(
    () => product.colors.find((color) => color.name === selectedColorName) ?? product.colors[0],
    [product.colors, selectedColorName]
  )

  const finishLabel = selectedColor.name

  return (
    <section className="p-1 md:p-2">
      {product.badge ? (
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
          {product.badge}
        </p>
      ) : null}

      <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.03em] md:text-4xl">
        {product.name}
      </h1>
      <p className="mt-3 text-base leading-7 text-muted-foreground">{product.tagline}</p>

      <div className="mt-5 flex flex-wrap items-end gap-x-3 gap-y-2">
        <p className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {formatPrice(product.price)}
        </p>
        {product.originalPrice ? (
          <p className="pb-1 text-sm text-muted-foreground line-through">
            {formatPrice(product.originalPrice)}
          </p>
        ) : null}
        <p className="pb-1 text-sm text-muted-foreground">{finishLabel}</p>
      </div>

      <div className="mt-8 border-t border-border/70 pt-6">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">Finish</p>

        <div className="mt-4 flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {product.colors.map((color) => {
            const isActive = color.name === selectedColor.name

            return (
              <button
                key={color.name}
                type="button"
                aria-label={`Select ${color.name}`}
                aria-pressed={isActive}
                onClick={() => setSelectedColorName(color.name)}
                className={cn(
                  'cursor-pointer shrink-0 rounded-full p-1 transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                  isActive ? 'scale-105' : ''
                )}
              >
                <span
                  className={cn(
                    'block h-8 w-8 rounded-full border transition-colors',
                    isActive ? 'border-2 border-primary ring-4 ring-primary/15' : 'border-border'
                  )}
                  style={{ backgroundColor: color.hex }}
                />
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-8 border-t border-border/70 pt-6">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">Size</p>

        <div className="mt-4 space-y-3">
          <button
            type="button"
            aria-pressed={sizeMode === 'kit'}
            onClick={() => {
              setSizeMode('kit')
              setSelectedSize(null)
            }}
            className={cn(
              'w-full cursor-pointer rounded-[1.5rem] border px-4 py-4 text-left transition-colors',
              sizeMode === 'kit'
                ? 'border-primary bg-primary/8 text-foreground'
                : 'border-border bg-background text-muted-foreground hover:border-primary/60 hover:text-foreground'
            )}
          >
            <span className="block text-sm font-medium text-foreground">Free sizing kit</span>
            <span className="mt-1 block text-sm text-muted-foreground">
              Best for first-time buyers who want to confirm fit before ring ships.
            </span>
          </button>

          <div
            className={cn(
              'rounded-[1.5rem] border px-4 py-4 transition-colors',
              sizeMode === 'custom'
                ? 'border-primary bg-primary/8'
                : 'border-border bg-background hover:border-primary/60'
            )}
          >
            <button
              type="button"
              aria-pressed={sizeMode === 'custom'}
              onClick={() => setSizeMode('custom')}
              className="w-full cursor-pointer text-left"
            >
              <span className="block text-sm font-medium text-foreground">Choose your size</span>
              <span className="mt-1 block text-sm text-muted-foreground">
                Pick your known size from 6 to 13.
              </span>
            </button>

            <AnimatePresence initial={false}>
              {sizeMode === 'custom' ? (
                <motion.div
                  initial={{ height: 0, opacity: 0, y: -6 }}
                  animate={{ height: 'auto', opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {product.sizes.map((size) => {
                      const isActive = selectedSize === size.value

                      return (
                        <button
                          key={size.value}
                          type="button"
                          aria-pressed={isActive}
                          disabled={!size.inStock}
                          onClick={() => setSelectedSize(size.value)}
                          className={cn(
                            'inline-flex h-11 w-full items-center justify-center rounded-full border text-sm font-medium transition-colors',
                            size.inStock
                              ? 'cursor-pointer'
                              : 'cursor-not-allowed border-border/60 bg-background/60 text-muted-foreground/60',
                            size.inStock &&
                              (isActive
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-border bg-background text-foreground hover:border-primary/60')
                          )}
                        >
                          {size.value}
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Add to cart
      </button>

      <p className="mt-3 text-sm text-muted-foreground">
        {sizeMode === 'kit'
          ? 'Sizing kit selected by default.'
          : selectedSize
            ? `Direct size ${selectedSize} selected.`
            : 'Choose an in-stock size to continue with direct fit.'}
      </p>
    </section>
  )
}
