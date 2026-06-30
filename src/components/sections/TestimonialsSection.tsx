import { testimonials } from '@/data/testimonials'

export function TestimonialsSection() {
  return (
    <section className="px-4 py-20 md:px-8 md:py-28 lg:px-0 lg:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
            Testimonials
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.02em] md:text-4xl">
            Worn like jewelry. Read like a coach.
          </h2>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3 lg:gap-6">
          {testimonials.map((testimonial) => (
            <article key={testimonial.name} className="rounded-3xl border border-border bg-card p-6">
              <p className="text-base leading-7 text-foreground">“{testimonial.quote}”</p>
              <div className="mt-6 border-t border-border pt-4">
                <p className="font-medium text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
