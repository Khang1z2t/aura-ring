import { products } from '@/data/products'
import { specs } from '@/data/specs'

export function SpecsSection() {
  return (
    <section id="specs" className="px-4 py-20 md:px-8 md:py-28 lg:px-0 lg:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">Specs</p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.02em] md:text-4xl">
            Same sensor core, tuned through four material identities.
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Aurora keeps the technical story readable: a shared baseline up top, then a tighter card
            for each model beneath it.
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-border bg-card p-6 md:p-8">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">Core system</p>
          <div className="mt-4 divide-y divide-border">
            {specs.map((item) => (
              <div key={item.label} className="grid gap-2 py-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="font-mono text-sm text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2 lg:gap-6">
          {products.map((product) => (
            <article key={product.id} className="rounded-3xl border border-border bg-card p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
                    {product.colors[0].name}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground">
                    {product.name}
                  </h3>
                </div>
                <p className="font-mono text-xl text-foreground">${product.price}</p>
              </div>

              <div className="mt-5 divide-y divide-border">
                {Object.entries(product.specs).map(([label, value]) => (
                  <div
                    key={label}
                    className="grid gap-2 py-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                  >
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="font-mono text-sm text-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
