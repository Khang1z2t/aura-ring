import type { Metadata } from 'next'

import { FloatingActionMenu } from '@/components/common/FloatingActionMenu'
import { Reveal } from '@/components/common/Reveal'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { ProductLineupSection } from '@/components/product/ProductLineupSection'
import { ProductsHero } from '@/components/product/ProductsHero'
import { siteConfig } from '@/config/site'
import { products } from '@/data/products'

export const metadata: Metadata = {
  title: 'Shop Smart Rings',
  description:
    'Compare all Aurora Ring models, finishes, prices, and signatures to find the smart ring that fits your routine.',
  alternates: {
    canonical: '/products',
  },
  openGraph: {
    title: 'Shop Smart Rings | Aurora Ring',
    description:
      'Compare all Aurora Ring models, finishes, prices, and signatures to find the smart ring that fits your routine.',
    url: '/products',
    siteName: siteConfig.brand,
    images: [siteConfig.ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop Smart Rings | Aurora Ring',
    description:
      'Compare all Aurora Ring models, finishes, prices, and signatures to find the smart ring that fits your routine.',
    images: [siteConfig.ogImage],
  },
}

export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground">
        <ProductsHero />

        <section className="pb-10 md:pb-14 lg:pb-16">
          {products.map((product, index) => (
            <div key={product.id} className={index === 0 ? undefined : 'border-t border-border/70'}>
              <ProductLineupSection product={product} />
            </div>
          ))}
        </section>

        <section className="px-4 pb-20 md:px-8 md:pb-24 lg:px-0 lg:pb-28">
          <Reveal
            variant="featured"
            className="mx-auto max-w-4xl rounded-[2rem] border border-border bg-card/50 p-6 md:p-8 lg:p-10"
          >
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
              Aurora lineup
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.03em] md:text-4xl">
              One signal system, four material personalities.
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">
              Aura Air keeps the profile light and soft. Aura Pro stays balanced for everyday
              training and recovery. Aura Elite leans warm, polished, and jewelry-forward. Aura
              Obsidian strips everything back to black. Same quiet biometric core, different way to
              wear it.
            </p>
          </Reveal>
        </section>
      </main>
      <Footer />
      <FloatingActionMenu />
    </>
  )
}
