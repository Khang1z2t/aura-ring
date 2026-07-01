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
import { getAllSlugs, getProductBySlug } from '@/data/products'
import { slugify } from '@/lib/utils'

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

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    color?: string | string[]
  }>
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
