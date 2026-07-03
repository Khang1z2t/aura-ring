'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Reveal } from '@/components/common/Reveal'
import { RevealGroup } from '@/components/common/RevealGroup'
import { cn } from '@/lib/utils'
import type { Product } from '@/types/product'

import { ProductColorCard } from './ProductColorCard'

interface ProductLineupSectionProps {
  product: Product
}

export function ProductLineupSection({ product }: ProductLineupSectionProps) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const showMobileControls = product.colors.length > 1
  const showDesktopControls = product.colors.length > 4
  const useDesktopCarousel = product.colors.length > 4
  const desktopCardWidth = 'lg:w-[19rem]'

  const updateScrollState = () => {
    const node = carouselRef.current

    if (!node) {
      return
    }

    const maxScrollLeft = node.scrollWidth - node.clientWidth
    const threshold = 4

    setCanScrollLeft(node.scrollLeft > threshold)
    setCanScrollRight(maxScrollLeft - node.scrollLeft > threshold)
  }

  useEffect(() => {
    updateScrollState()

    const node = carouselRef.current

    if (!node) {
      return
    }

    node.addEventListener('scroll', updateScrollState)
    window.addEventListener('resize', updateScrollState)

    return () => {
      node.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [product.colors.length])

  const scrollCards = (direction: 'left' | 'right') => {
    const node = carouselRef.current

    if (!node) {
      return
    }

    const amount = Math.max(node.clientWidth * 0.82, 280)
    node.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  return (
    <section className="px-4 py-12 md:px-8 md:py-16 lg:px-0 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <Reveal variant="fade" className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
          <div className="max-w-3xl">
            <h2 className="font-display text-4xl font-semibold tracking-[-0.03em] md:text-5xl">
              {product.name}
            </h2>

            <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
              {product.tagline}
            </p>

            {showMobileControls ? (
              <div className="mt-4 flex items-center gap-2 lg:hidden">
                <button
                  type="button"
                  data-track={`lineup-left-${product.slug}`}
                  aria-label={`Scroll ${product.name} colors left`}
                  onClick={() => scrollCards('left')}
                  disabled={!canScrollLeft}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-card-foreground transition-colors hover:border-border-strong hover:bg-card-hover disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-border disabled:hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  data-track={`lineup-right-${product.slug}`}
                  aria-label={`Scroll ${product.name} colors right`}
                  onClick={() => scrollCards('right')}
                  disabled={!canScrollRight}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-card-foreground transition-colors hover:border-border-strong hover:bg-card-hover disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-border disabled:hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            ) : null}
          </div>

          {showDesktopControls ? (
            <div className="hidden shrink-0 items-center gap-2 lg:flex lg:pt-1">
              <button
                type="button"
                data-track={`lineup-desktop-left-${product.slug}`}
                aria-label={`Scroll ${product.name} colors left`}
                onClick={() => scrollCards('left')}
                disabled={!canScrollLeft}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-card-foreground transition-colors hover:border-border-strong hover:bg-card-hover disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-border disabled:hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label={`Scroll ${product.name} colors right`}
                data-track={`lineup-desktop-right-${product.slug}`}
                onClick={() => scrollCards('right')}
                disabled={!canScrollRight}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-card-foreground transition-colors hover:border-border-strong hover:bg-card-hover disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-border disabled:hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </Reveal>

        <RevealGroup
          containerRef={carouselRef}
          className={cn(
            'mt-8 gap-4 lg:gap-5',
            showMobileControls
              ? 'flex snap-x snap-mandatory overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
              : 'grid',
            useDesktopCarousel
              ? 'lg:flex lg:flex-nowrap lg:max-w-none lg:overflow-x-auto lg:pb-2 lg:snap-none'
              : 'lg:flex lg:flex-wrap lg:overflow-visible lg:pb-0 lg:snap-none'
          )}
        >
          {product.colors.map((color) => (
            <Reveal
              key={`${product.id}-${color.name}`}
              variant="stagger-item"
              className={cn(
                'w-[15.5rem] shrink-0 snap-start sm:w-[17rem] md:w-[18rem]',
                useDesktopCarousel
                  ? `${desktopCardWidth} lg:snap-start`
                  : `${desktopCardWidth} lg:shrink-0 lg:snap-none`
              )}
            >
              <ProductColorCard product={product} color={color} />
            </Reveal>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
