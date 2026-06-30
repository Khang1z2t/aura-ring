'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { CircleHelp, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'

import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn, formatPrice, slugify } from '@/lib/utils'
import { useCartStore } from '@/store/useCartStore'
import type { Product } from '@/types/product'

interface ProductDetailPurchasePanelProps {
  product: Product
  initialColorSlug: string | null
}

const sizeGuideTabs = {
  kit: {
    label: 'Sizing kit',
    title: 'Use free sizing kit first',
    intro:
      'Best if this is your first smart ring. It lets you test comfort across temperature and finger swelling before you lock final size.',
    steps: [
      'Wear sample size on intended finger for at least a few hours.',
      'Check fit in morning and again later at night when fingers are warmer.',
      'Keep it snug enough to stay put, but loose enough to slide off without force.',
    ],
  },
  tape: {
    label: 'Measure tape',
    title: 'Measure with tape or paper strip',
    intro:
      'Fastest at-home method if you do not want to wait for a kit. Measure more than once for a cleaner read.',
    steps: [
      'Wrap soft tape or thin paper around base of finger where ring will sit.',
      'Mark where ends meet, then measure full length in millimeters.',
      'Compare your circumference to table below and size up if you land between two sizes.',
    ],
  },
  ring: {
    label: 'Existing ring',
    title: 'Match with ring you already own',
    intro:
      'Works well if you already own ring that fits same finger comfortably for daily wear.',
    steps: [
      'Choose ring that already fits intended finger, not a different hand.',
      'Measure inside circumference or compare inner diameter against a ring chart.',
      'Use closest match below, then size up if current ring already feels tight at night.',
    ],
  },
} as const

const sizeGuideChart = [
  { size: '6', circumference: '51.9 mm' },
  { size: '7', circumference: '54.4 mm' },
  { size: '8', circumference: '57.0 mm' },
  { size: '9', circumference: '59.5 mm' },
  { size: '10', circumference: '62.1 mm' },
  { size: '11', circumference: '64.6 mm' },
  { size: '12', circumference: '67.2 mm' },
  { size: '13', circumference: '69.7 mm' },
] as const

const sizeGuideIllustration = {
  kit: 'Fit sample ring on finger and test through day',
  tape: 'Wrap tape around finger and read millimeters',
  ring: 'Use ring you own as reference point',
} as const

function SizeGuideFigure({ mode }: { mode: keyof typeof sizeGuideTabs }) {
  return (
    <svg
      viewBox="0 0 320 180"
      aria-label={sizeGuideIllustration[mode]}
      className="h-auto w-full"
      role="img"
    >
      <defs>
        <linearGradient id="size-guide-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="318" height="178" rx="28" fill="url(#size-guide-glow)" className="text-primary" />
      <rect x="1" y="1" width="318" height="178" rx="28" fill="none" stroke="currentColor" strokeOpacity="0.08" className="text-foreground" />
      <path d="M121 38c-18 0-31 14-31 33v37c0 20 13 34 31 34 17 0 30-14 30-34V92h18v16c0 20 13 34 31 34s31-14 31-34V71c0-19-13-33-31-33-17 0-31 14-31 33v9h-18v-9c0-19-13-33-30-33Z" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/80" />
      {mode === 'kit' ? <circle cx="121" cy="94" r="18" fill="none" stroke="currentColor" strokeWidth="8" className="text-primary" /> : null}
      {mode === 'tape' ? <path d="M62 123c25-18 58-27 98-27 42 0 78 9 107 27" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="7 10" strokeLinecap="round" className="text-primary" /> : null}
      {mode === 'ring' ? <circle cx="200" cy="90" r="25" fill="none" stroke="currentColor" strokeWidth="8" className="text-primary" /> : null}
      <text x="24" y="155" fill="currentColor" className="text-muted-foreground" fontSize="13" opacity="0.72">
        {sizeGuideIllustration[mode]}
      </text>
    </svg>
  )
}

function SizeGuideTable() {
  const leftColumn = sizeGuideChart.slice(0, 4)
  const rightColumn = sizeGuideChart.slice(4)

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {[leftColumn, rightColumn].map((column, columnIndex) => (
        <div key={columnIndex} className="overflow-hidden rounded-[1.1rem] bg-foreground/[0.03]">
          <div className="grid grid-cols-[1fr_auto] gap-3 px-4 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <span>Circumference</span>
            <span>US size</span>
          </div>
          <div>
            {column.map((entry) => (
              <div
                key={entry.size}
                className="grid grid-cols-[1fr_auto] gap-3 px-4 py-3 text-sm text-foreground even:bg-foreground/[0.025]"
              >
                <span className="tabular-nums text-foreground/82">{entry.circumference}</span>
                <span className="tabular-nums font-medium">{entry.size}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function SizeGuideSteps({ steps }: { steps: readonly string[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((step, index) => (
        <li key={step} className="grid grid-cols-[auto_1fr] gap-3">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
            {index + 1}
          </span>
          <p className="pt-0.5 text-sm leading-6 text-muted-foreground">{step}</p>
        </li>
      ))}
    </ol>
  )
}

function SizeGuideContent({ mode }: { mode: keyof typeof sizeGuideTabs }) {
  const tab = sizeGuideTabs[mode]

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8">
      <div className="hidden lg:block">
        <SizeGuideFigure mode={mode} />
        <div className="mt-5">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">Size 6–13 guide</p>
          <div className="mt-3">
            <SizeGuideTable />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-medium tracking-[-0.03em] text-foreground">{tab.title}</h3>
        <p className="mt-3 max-w-[34rem] text-sm leading-7 text-muted-foreground">{tab.intro}</p>
        <div className="mt-5">
          <SizeGuideSteps steps={tab.steps} />
        </div>
        <div className="mt-6 lg:hidden">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">Size 6–13 guide</p>
          <div className="mt-3">
            <SizeGuideTable />
          </div>
        </div>
      </div>
    </div>
  )
}

function SizeGuideDialog({
  activeTab,
  onTabChange,
  onClose,
  onPickKit,
}: {
  activeTab: keyof typeof sizeGuideTabs
  onTabChange: (tab: keyof typeof sizeGuideTabs) => void
  onClose: () => void
  onPickKit: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/25 px-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: 16, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 16, opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        role="dialog"
        aria-modal="true"
        aria-label="Ring size guide"
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[88dvh] w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] bg-background/96 p-5 shadow-[0_30px_80px_-36px_rgba(15,23,42,0.48)] ring-1 ring-border/60 md:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">Size guide</p>
            <h2 className="mt-2 max-w-[18ch] font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">
              Find your best ring fit
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close size guide"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/[0.05] hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-b border-border/70 pb-3">
          {Object.entries(sizeGuideTabs).map(([key, tab]) => {
            const isActive = activeTab === key

            return (
              <button
                key={key}
                type="button"
                onClick={() => onTabChange(key as keyof typeof sizeGuideTabs)}
                className={cn(
                  'relative pb-2 text-sm font-medium transition-colors',
                  isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    'absolute inset-x-0 -bottom-[13px] h-px bg-primary transition-opacity',
                    isActive ? 'opacity-100' : 'opacity-0'
                  )}
                />
              </button>
            )
          })}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-color:rgba(196,123,61,0.75)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary/70 [&::-webkit-scrollbar-track]:bg-transparent">
          <SizeGuideContent mode={activeTab} />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-4 text-sm">
          <p className="text-muted-foreground">
            Still unsure?{' '}
            <button
              type="button"
              onClick={onPickKit}
              className="font-medium text-primary transition-colors hover:text-primary/80"
            >
              Order a free sizing kit
            </button>
          </p>
          <p className="tabular-nums text-muted-foreground/85">Circumference (mm) → US Size</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function ProductDetailPurchasePanel({
  product,
  initialColorSlug,
}: ProductDetailPurchasePanelProps) {
  const initialColor =
    product.colors.find((color) => slugify(color.name) === initialColorSlug) ?? product.colors[0]

  const router = useRouter()
  const addItem = useCartStore((state) => state.addItem)
  const [selectedColorName, setSelectedColorName] = useState(initialColor.name)
  const [sizeMode, setSizeMode] = useState<'kit' | 'custom'>('kit')
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [showStickySummary, setShowStickySummary] = useState(false)
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false)
  const [activeSizeGuideTab, setActiveSizeGuideTab] = useState<keyof typeof sizeGuideTabs>('kit')
  const purchasePanelRef = useRef<HTMLElement | null>(null)
  const finishSectionRef = useRef<HTMLDivElement | null>(null)
  const addToCartRef = useRef<HTMLButtonElement | null>(null)

  const selectedColor = useMemo(
    () => product.colors.find((color) => color.name === selectedColorName) ?? product.colors[0],
    [product.colors, selectedColorName]
  )
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const finishLabel = selectedColor.name

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      quantity: 1,
      selectedColor: selectedColor.name,
      sizeMode,
      selectedSize: sizeMode === 'custom' ? selectedSize : null,
    })

    router.push('/cart')
  }

  useEffect(() => {
    const panel = purchasePanelRef.current
    const finishSection = finishSectionRef.current
    const button = addToCartRef.current

    if (!panel || !finishSection || !button) return

    const updateStickySummary = () => {
      const panelRect = panel.getBoundingClientRect()
      const finishRect = finishSection.getBoundingClientRect()
      const buttonRect = button.getBoundingClientRect()
      const footerRect = document.querySelector('footer')?.getBoundingClientRect()
      const hasEnteredPanel = panelRect.top <= 96
      const hasLostFinish = finishRect.bottom <= 88
      const hasLostPrimaryCta = buttonRect.bottom <= 88
      const footerReached = footerRect ? footerRect.top <= window.innerHeight - 92 : false

      setShowStickySummary(
        isDesktop && hasEnteredPanel && (hasLostFinish || hasLostPrimaryCta) && !footerReached
      )
    }

    updateStickySummary()
    window.addEventListener('scroll', updateStickySummary, { passive: true })
    window.addEventListener('resize', updateStickySummary)

    return () => {
      window.removeEventListener('scroll', updateStickySummary)
      window.removeEventListener('resize', updateStickySummary)
    }
  }, [isDesktop])

  return (
    <section ref={purchasePanelRef} className="p-1 md:p-2">
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

      <div ref={finishSectionRef} className="mt-8 border-t border-border/70 pt-6">
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
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">Size</p>
          <button
            type="button"
            aria-label="Open size guide"
            onClick={() => setIsSizeGuideOpen(true)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <CircleHelp className="h-3.5 w-3.5" />
          </button>
        </div>

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
        ref={addToCartRef}
        type="button"
        onClick={handleAddToCart}
        disabled={sizeMode === 'custom' && !selectedSize}
        className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/50"
      >
        Add to cart
      </button>

      <AnimatePresence>
        {isSizeGuideOpen ? (
          <SizeGuideDialog
            activeTab={activeSizeGuideTab}
            onTabChange={setActiveSizeGuideTab}
            onClose={() => setIsSizeGuideOpen(false)}
            onPickKit={() => {
              setSizeMode('kit')
              setSelectedSize(null)
              setIsSizeGuideOpen(false)
            }}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showStickySummary ? (
          <motion.div
            initial={{ y: 56, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 56, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none fixed inset-x-0 bottom-3 z-40 px-4 md:px-6 lg:px-8"
          >
            <div className="pointer-events-auto mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-[1.5rem] border border-border/80 bg-background/88 px-4 py-3 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.45)] backdrop-blur-xl md:px-5">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground md:text-base">{product.name}</p>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {finishLabel} <span className="px-1.5 text-border">·</span>{' '}
                  <span className="tabular-nums text-foreground/88">{formatPrice(product.price)}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={sizeMode === 'custom' && !selectedSize}
                className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/50"
              >
                Add to cart
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

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
