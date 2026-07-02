import type { Metadata } from 'next'
import {
  Activity,
  Brain,
  Dumbbell,
  Gem,
  MoonStar,
  RefreshCw,
  Shield,
  Sparkles,
  Waves,
} from 'lucide-react'
import { notFound } from 'next/navigation'

import { FloatingActionMenu } from '@/components/common/FloatingActionMenu'
import { Reveal } from '@/components/common/Reveal'
import { RevealGroup } from '@/components/common/RevealGroup'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { ProductDetailImage } from '@/components/product/ProductDetailImage'
import { ProductDetailPurchasePanel } from '@/components/product/ProductDetailPurchasePanel'
import { siteConfig } from '@/config/site'
import { getAllSlugs, getProductBySlug, products } from '@/data/products'
import { cn, formatPrice, slugify } from '@/lib/utils'

const featureIcons = {
  activity: Activity,
  brain: Brain,
  dumbbell: Dumbbell,
  gem: Gem,
  'moon-star': MoonStar,
  'refresh-cw': RefreshCw,
  shield: Shield,
  sparkles: Sparkles,
  waves: Waves,
} as const

const comparisonRowLabels = [
  'Best for',
  'Battery',
  'Weight',
  'Water resistance',
  'Finish',
  'Style cue',
] as const

const faqItems = [
  {
    question: 'How do I choose my size?',
    answer:
      'Use sizing kit if you are between sizes or wear ring through day and night. Direct size works if you already know fit on intended finger.',
  },
  {
    question: 'How long battery lasts?',
    answer:
      'Battery varies by model from 7 to 9 days, depending on sensor use and settings. Pro and Elite last longer than Air.',
  },
  {
    question: 'Can I wear it in shower or swim?',
    answer: 'Yes. All models are water resistant for daily wear, shower, hand wash, and swim use.',
  },
  {
    question: 'Does it work with iPhone and Android?',
    answer: 'Yes. Aurora supports iOS 16+ and Android 10+ with Bluetooth LE.',
  },
] as const

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    color?: string | string[]
  }>
}

function getComparisonValues(productId: string) {
  const model = products.find((item) => item.id === productId)
  const bestFor =
    model?.id === 'air'
      ? 'Light daily recovery'
      : model?.id === 'pro'
        ? 'Training + balance'
        : model?.id === 'elite'
          ? 'Luxury daily wear'
          : 'Hard use + stealth'

  return {
    id: model?.id ?? productId,
    name: model?.name ?? '',
    price: formatPrice(model?.price ?? 0),
    badge: model?.badge,
    tagline: model?.tagline ?? '',
    values: [
      bestFor,
      model?.specs.Battery ?? '',
      model?.specs.Weight ?? '',
      model?.specs.Water ?? '',
      model?.specs.Material ?? '',
      model?.id === 'air'
        ? 'Quiet and light'
        : model?.id === 'pro'
          ? 'Balanced and sporty'
          : model?.id === 'elite'
            ? 'Warm and polished'
            : 'Stealth and durable',
    ],
  }
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    return {
      title: 'Product not found',
    }
  }

  const title = `${product.name} | Aurora Ring`
  const description = `${product.tagline} Explore colors, sizes, sensors, battery life, and specs for ${product.name}.`

  return {
    title,
    description,
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/products/${product.slug}`,
      siteName: siteConfig.brand,
      images: [product.images[0]?.src ?? siteConfig.ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.images[0]?.src ?? siteConfig.ogImage],
    },
  }
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { slug } = await params
  const { color } = await searchParams
  const product = getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const colorSlug = typeof color === 'string' ? color : color?.[0]
  const validColor = product.colors.find((item) => slugify(item.name) === colorSlug)
  const initialColorSlug = validColor ? slugify(validColor.name) : null
  const comparisonModels = products.map((item) => ({ ...getComparisonValues(item.id), id: item.id }))
  const comparisonIndex = comparisonModels.findIndex((item) => item.id === product.id)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground">
        <section className="px-4 py-8 md:px-8 md:py-10 lg:px-0 lg:py-12">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(22rem,0.85fr)] lg:items-start lg:gap-10">
            <ProductDetailImage product={product} />
            <ProductDetailPurchasePanel product={product} initialColorSlug={initialColorSlug} />
          </div>
        </section>

        <section className="px-4 pb-20 md:px-8 md:pb-24 lg:px-0 lg:pb-28">
          <div className="mx-auto max-w-7xl space-y-10">
            <Reveal variant="fade" className="border-t border-border/70 pt-8">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
                Why choose {product.name}
              </p>
              <RevealGroup className="mt-5 grid gap-4 md:grid-cols-3">
                {product.features.map((feature) => {
                  const Icon = featureIcons[feature.icon as keyof typeof featureIcons] ?? Sparkles

                  return (
                    <Reveal key={feature.title} variant="stagger-item">
                      <article className="rounded-[1.75rem] border border-border bg-card/50 p-5">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Icon className="h-4 w-4" />
                        </span>
                        <h2 className="mt-4 text-base font-medium text-foreground md:text-lg">
                          {feature.title}
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {feature.description}
                        </p>
                      </article>
                    </Reveal>
                  )
                })}
              </RevealGroup>
            </Reveal>

            <Reveal variant="fade" className="border-t border-border/70 pt-8">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
                    Compare models
                  </p>
                  <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.03em] md:text-4xl">
                    Pick by feel, not just spec sheet.
                  </h2>
                </div>
                <p className="max-w-xl text-sm leading-6 text-muted-foreground md:text-right md:text-base">
                  Air stays light, Pro stays balanced, Elite reads more jewelry, Obsidian keeps it
                  stealth.
                </p>
              </div>

              <div className="mt-6 grid gap-3 md:hidden">
                {comparisonModels.map((model) => {
                  const isCurrent = model.id === product.id

                  return (
                    <article
                      key={model.id}
                      className={cn(
                        'rounded-[1.5rem] border p-5 transition-colors',
                        isCurrent ? 'border-primary bg-primary/[0.04]' : 'border-border bg-card/45'
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-base font-medium text-foreground">{model.name}</p>
                          <p className="mt-1 text-sm leading-6 text-muted-foreground">{model.tagline}</p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-base font-semibold text-foreground">{model.price}</p>
                          <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                            {isCurrent ? 'This model' : model.badge ?? 'Series'}
                          </p>
                        </div>
                      </div>

                      <dl className="mt-4 space-y-3 border-t border-border/70 pt-4">
                        {comparisonRowLabels.slice(0, 4).map((label, index) => (
                          <div key={label} className="flex items-start justify-between gap-4">
                            <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                              {label}
                            </dt>
                            <dd className="max-w-[55%] text-right text-sm leading-6 text-foreground">
                              {model.values[index]}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </article>
                  )
                })}
              </div>

              <div className="mt-6 hidden overflow-hidden rounded-[1.75rem] border border-border bg-card/45 md:block">
                <div className="grid grid-cols-[1.1fr_repeat(4,minmax(0,1fr))] border-b border-border/70 bg-foreground/[0.02] text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground md:text-xs">
                  <div className="px-4 py-4 md:px-5">Model</div>
                  {comparisonModels.map((model) => (
                    <div key={model.id} className="px-4 py-4 text-center md:px-5">
                      <p className="text-foreground">{model.name}</p>
                      <p className="mt-1 text-[10px] tracking-[0.16em] text-muted-foreground">
                        {model.price}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="divide-y divide-border/70">
                  {comparisonRowLabels.map((label, rowIndex) => (
                    <div
                      key={label}
                      className={cn(
                        'grid grid-cols-[1.1fr_repeat(4,minmax(0,1fr))] text-sm',
                        rowIndex === 0 ? 'bg-primary/[0.04]' : 'bg-transparent'
                      )}
                    >
                      <div className="px-4 py-4 font-medium text-foreground md:px-5">{label}</div>
                      {comparisonModels.map((model, index) => (
                        <div
                          key={`${label}-${model.id}`}
                          className={cn(
                            'px-4 py-4 text-center text-muted-foreground md:px-5',
                            rowIndex === 0 && index === comparisonIndex ? 'font-medium text-foreground' : ''
                          )}
                        >
                          {model.values[rowIndex]}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal variant="fade" className="border-t border-border/70 pt-8">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">FAQ</p>
                  <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.03em] md:text-4xl">
                    Short answers before checkout.
                  </h2>
                </div>
                <p className="max-w-xl text-sm leading-6 text-muted-foreground md:text-right md:text-base">
                  Kept brief so page still feels premium, not like support docs.
                </p>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {faqItems.map((item, index) => (
                  <Reveal key={item.question} variant="stagger-item" delay={0.04 * index}>
                    <article className="rounded-[1.5rem] border border-border bg-card/50 p-5">
                      <h3 className="text-base font-medium text-foreground">{item.question}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
                    </article>
                  </Reveal>
                ))}
              </div>
            </Reveal>

            <Reveal variant="fade" className="border-t border-border/70 pt-8">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
                Specifications
              </p>
              <dl className="mt-4 space-y-3 text-sm md:text-base">
                {Object.entries(product.specs).map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-start justify-between gap-6 border-b border-border/70 pb-3 last:border-b-0 last:pb-0"
                  >
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="text-right font-medium text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingActionMenu />
    </>
  )
}
