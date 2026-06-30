import { features } from '@/data/features'

export function FeaturesSection() {
  return (
    <section id="features" className="px-4 py-20 md:px-8 md:py-28 lg:px-0 lg:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">Features</p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.02em] md:text-4xl">
            Health signals shaped like quiet luxury hardware.
          </h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Aurora turns recovery data into a warmer, calmer interface built for people who want
            clarity without another glowing screen.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-6">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-3xl border border-border bg-card p-6 transition duration-200 hover:border-border-strong hover:bg-card-hover"
            >
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
                {feature.eyebrow}
              </p>
              <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-foreground">
                {feature.title}
              </h3>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
