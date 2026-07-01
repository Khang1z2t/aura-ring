import Image from 'next/image'

import { Reveal } from '@/components/common/Reveal'
import type { Product } from '@/types/product'


interface ProductDetailImageProps {
  product: Product
}

export function ProductDetailImage({ product }: ProductDetailImageProps) {
  const image = product.images[0]

  return (
    <Reveal variant="featured">
      <section className="rounded-[2rem] border border-border bg-card/60 p-4 md:p-6 lg:p-8">
        <div className="relative overflow-hidden rounded-[1.5rem] bg-surface">
          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4 md:p-5">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
              {product.name}
            </p>
            {product.badge ? (
              <span className="rounded-full bg-background/85 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground backdrop-blur-sm">
                {product.badge}
              </span>
            ) : null}
          </div>

          <div className="aspect-[1/1.02] md:aspect-[1.05/1]">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className="h-full w-full object-contain p-6 md:p-8 lg:p-10"
              priority
            />
          </div>
        </div>
      </section>
    </Reveal>
  )
}
