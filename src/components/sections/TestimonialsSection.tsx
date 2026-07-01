import { Reveal } from '@/components/common/Reveal'
import { RevealGroup } from '@/components/common/RevealGroup'
import { testimonials } from '@/data/testimonials'

export function TestimonialsSection() {
  const [featured, ...secondary] = testimonials

  return (
    <section className="px-4 py-20 md:px-8 md:py-28 lg:px-0 lg:py-36">
      <div className="mx-auto max-w-7xl">
        <Reveal variant="featured" amount={0.08} className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
              Testimonials
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.03em] text-balance md:text-4xl">
              Worn like jewelry. Read like a coach.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-muted-foreground lg:justify-self-end lg:text-right">
            Short, human feedback beats another glossy metrics grid — especially on a page already
            full of product detail.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-6">
          <Reveal variant="featured">
            <article className="rounded-[2rem] bg-gradient-to-br from-card/80 to-card/35 p-7 ring-1 ring-white/6 md:p-8">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">Featured note</p>
              <p className="mt-6 max-w-[18ch] font-display text-3xl font-semibold leading-tight tracking-[-0.03em] text-foreground md:text-4xl">
                “{featured.quote}”
              </p>
              <div className="mt-8 border-t border-border/70 pt-4">
                <p className="font-medium text-foreground">{featured.name}</p>
                <p className="text-sm text-muted-foreground">{featured.role}</p>
              </div>
            </article>
          </Reveal>

          <RevealGroup className="grid gap-4">
            {secondary.map((testimonial) => (
              <Reveal key={testimonial.name} variant="stagger-item">
                <article className="rounded-[1.75rem] border border-border/70 bg-transparent p-6 transition duration-200 hover:bg-card/20">
                  <p className="text-base leading-7 text-foreground">“{testimonial.quote}”</p>
                  <div className="mt-6 border-t border-border/70 pt-4">
                    <p className="font-medium text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  )
}
