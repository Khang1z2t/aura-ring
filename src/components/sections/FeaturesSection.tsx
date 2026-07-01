import { Activity, MoonStar, Sparkles } from 'lucide-react'

import { Reveal } from '@/components/common/Reveal'
import { RevealGroup } from '@/components/common/RevealGroup'
import { features } from '@/data/features'

const featureIcons = [MoonStar, Activity, Sparkles] as const

export function FeaturesSection() {
  return (
    <section id="features" className="px-4 py-20 md:px-8 md:py-28 lg:px-0 lg:py-36">
      <div className="mx-auto max-w-7xl">
        <Reveal variant="featured" amount={0.08} className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">Features</p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.03em] text-balance md:text-4xl">
              Health signals shaped like quiet luxury hardware.
            </h2>
            <p className="mt-3 max-w-[62ch] text-base leading-7 text-muted-foreground">
              Aurora turns recovery data into a warmer, calmer interface built for people who want
              clarity without another glowing screen.
            </p>
          </div>

          <p className="max-w-md text-sm leading-6 text-muted-foreground lg:justify-self-end lg:text-right">
            Less dashboard noise, more morning clarity — built to read quickly, wear daily, and
            disappear back into your routine.
          </p>
        </Reveal>

        <RevealGroup className="mt-12 overflow-hidden rounded-[2rem] border border-border/70 bg-card/30 backdrop-blur-sm">
          {features.map((feature, index) => {
            const Icon = featureIcons[index] ?? Sparkles

            return (
              <Reveal
                key={feature.title}
                variant="stagger-item"
                delay={0.07 * index}
                className="grid gap-5 border-b border-border/60 px-5 py-6 last:border-b-0 md:grid-cols-[120px_minmax(0,1fr)] md:px-8 md:py-7"
              >
                <div className="flex items-center justify-between gap-4 md:block">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground md:mt-4">
                    {feature.eyebrow}
                  </p>
                </div>

                <div className="grid gap-3 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] md:gap-6">
                  <h3 className="font-display text-2xl font-semibold tracking-[-0.03em] text-foreground md:text-[1.75rem]">
                    {feature.title}
                  </h3>
                  <p className="max-w-[58ch] text-base leading-7 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </Reveal>
            )
          })}
        </RevealGroup>
      </div>
    </section>
  )
}
