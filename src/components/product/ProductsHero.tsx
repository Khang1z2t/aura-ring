import { Reveal } from '@/components/common/Reveal'

export function ProductsHero() {
  return (
    <section className="px-4 pt-20 pb-14 md:px-8 md:pt-24 md:pb-16 lg:px-0 lg:pt-28 lg:pb-20">
      <Reveal variant="fade" className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">Products</p>
          <h1 className="mt-6 max-w-5xl font-display text-5xl font-semibold tracking-[-0.04em] md:text-7xl lg:text-[5.5rem] lg:leading-[0.95]">
            Wear your rhythm.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground md:text-lg">
            Four material stories for one quiet biometric core.
          </p>
        </div>
      </Reveal>
    </section>
  )
}
