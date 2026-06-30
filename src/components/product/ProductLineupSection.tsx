import { cn } from '@/lib/utils'
import type { Product } from '@/types/product'

import { ProductColorCard } from './ProductColorCard'

interface ProductLineupSectionProps {
  product: Product
}

export function ProductLineupSection({ product }: ProductLineupSectionProps) {
  return (
    <section className="px-4 py-12 md:px-8 md:py-16 lg:px-0 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <h2 className="font-display text-4xl font-semibold tracking-[-0.03em] md:text-5xl">
            {product.name}
          </h2>
          <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
            {product.tagline}
          </p>
        </div>

        <div
          className={cn(
            'mt-8 grid gap-4 md:max-w-[56rem] lg:gap-5',
            product.colors.length > 1 ? 'md:grid-cols-2' : 'md:max-w-[28rem]'
          )}
        >
          {product.colors.map((color) => (
            <ProductColorCard key={`${product.id}-${color.name}`} product={product} color={color} />
          ))}
        </div>
      </div>
    </section>
  )
}
