'use client'

import { useEffect, useState } from 'react'

import { Activity, MoonStar, Sparkles } from 'lucide-react'

import { ProgressiveImage } from '@/components/common/ProgressiveImage'
import { Reveal } from '@/components/common/Reveal'
import { RevealGroup } from '@/components/common/RevealGroup'
import { cn } from '@/lib/utils'
import { features } from '@/data/features'

const featureIcons = [MoonStar, Activity, Sparkles] as const

const lifestyleShots = [
  {
    src: '/images/lifestyle/aura_elite_lifestyle.webp',
    alt: 'Aurora Elite lifestyle close-up',
    title: 'Quiet luxury, worn daily.',
  },
  {
    src: '/images/lifestyle/aura_air_lifestyle.webp',
    alt: 'Aurora Air lifestyle close-up',
    title: 'Light enough for all-day wear',
  },
  {
    src: '/images/lifestyle/aura_pro_lifestyle.webp',
    alt: 'Aurora Pro lifestyle close-up',
    title: 'Recovery data, no screen glow',
  },
  {
    src: '/images/lifestyle/aura_obsidian_lifestyle.webp',
    alt: 'Aurora Obsidian lifestyle close-up',
    title: 'Four finishes, one calm system',
  },
] as const

const [heroShot, sideShot, detailShot, accentShot] = lifestyleShots

export function FeaturesSection() {
  const [activeShot, setActiveShot] = useState(0)

  useEffect(() => {
    if (lifestyleShots.length < 2) {
      return
    }

    const timer = window.setInterval(() => {
      setActiveShot((current) => (current + 1) % lifestyleShots.length)
    }, 4200)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <section id="features" className="px-4 py-20 md:px-8 md:py-28 lg:px-0 lg:py-36">
      <div className="mx-auto max-w-7xl">
        <Reveal variant="featured" amount={0.12} once className="md:hidden">
          <div className="relative overflow-hidden rounded-[1.75rem] bg-surface">
            <div className="relative min-h-[26rem]">
              {lifestyleShots.map((shot, index) => {
                const isActive = index === activeShot

                return (
                  <div
                    key={shot.src}
                    aria-hidden={!isActive}
                    className={cn(
                      'absolute inset-0 transition-all duration-700 ease-out',
                      isActive ? 'z-10 opacity-100 scale-100' : 'z-0 opacity-0 scale-[1.02]'
                    )}
                  >
                    <ProgressiveImage
                      src={shot.src}
                      alt=""
                      width={960}
                      height={1200}
                      aria-hidden="true"
                      className="absolute inset-0 h-full w-full scale-110 object-cover object-center blur-2xl opacity-60"
                    />
                    <ProgressiveImage
                      src={shot.src}
                      alt={shot.alt}
                      fill
                      sizes="100vw"
                      priority={index === 0}
                      wrapperClassName="absolute inset-0"
                      className="object-cover object-center"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/78 via-black/20 to-transparent" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 px-5 pb-6 pt-16">
                      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/75">Editorial</p>
                      <p className="mt-2 max-w-[14ch] font-display text-2xl font-semibold tracking-[-0.03em] text-white">
                        {shot.title}
                      </p>
                    </div>
                  </div>
                )
              })}

              <div className="absolute inset-x-0 bottom-4 z-20 flex items-center justify-center gap-2">
                {lifestyleShots.map((shot, index) => {
                  const isActive = index === activeShot

                  return (
                    <button
                      key={shot.src}
                      type="button"
                      aria-label={`Show image ${index + 1}`}
                      aria-current={isActive}
                      onClick={() => setActiveShot(index)}
                      className={cn(
                        'h-1.5 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/80',
                        isActive ? 'w-7 bg-white' : 'w-2.5 bg-white/45 hover:bg-white/75'
                      )}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal
          variant="featured"
          amount={0.12}
          once
          className="hidden md:grid md:grid-cols-4 md:gap-3 md:auto-rows-[220px] lg:auto-rows-[260px]"
        >
          <div className="group relative col-span-2 row-span-2 overflow-hidden rounded-[1.75rem] bg-surface">
            <ProgressiveImage
              src={heroShot.src}
              alt=""
              width={960}
              height={1200}
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-110 object-cover object-center blur-2xl opacity-60"
            />
            <ProgressiveImage
              src={heroShot.src}
              alt={heroShot.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
              wrapperClassName="absolute inset-0"
              className="object-cover object-center transition duration-500 group-hover:scale-[1.04]"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent px-6 pb-7 pt-12 md:px-7 md:pb-8">
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/75">Editorial</p>
              <p className="mt-2 max-w-[14ch] font-display text-2xl font-semibold tracking-[-0.03em] text-white md:text-3xl">
                {heroShot.title}
              </p>
            </div>
          </div>

          <div className="group relative col-span-2 row-span-1 overflow-hidden rounded-[1.5rem] bg-surface">
            <ProgressiveImage
              src={sideShot.src}
              alt=""
              width={960}
              height={1200}
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-110 object-cover object-center blur-2xl opacity-60"
            />
            <ProgressiveImage
              src={sideShot.src}
              alt={sideShot.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
              wrapperClassName="absolute inset-0"
              className="object-cover object-center transition duration-500 group-hover:scale-[1.05]"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent p-4 opacity-0 transition duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
              <p className="max-w-[14ch] font-display text-lg font-semibold tracking-[-0.03em] text-white md:text-xl">
                {sideShot.title}
              </p>
            </div>
          </div>

          <div className="group relative col-span-1 row-span-1 overflow-hidden rounded-[1.25rem] bg-surface">
            <ProgressiveImage
              src={detailShot.src}
              alt=""
              width={960}
              height={1200}
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-110 object-cover object-center blur-2xl opacity-60"
            />
            <ProgressiveImage
              src={detailShot.src}
              alt={detailShot.alt}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              wrapperClassName="absolute inset-0"
              className="object-cover object-center transition duration-500 group-hover:scale-[1.06]"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent p-4 opacity-0 transition duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
              <p className="max-w-[14ch] font-display text-base font-semibold tracking-[-0.03em] text-white md:text-lg">
                {detailShot.title}
              </p>
            </div>
          </div>

          <div className="group relative col-span-1 row-span-1 overflow-hidden rounded-[1.25rem] bg-surface">
            <ProgressiveImage
              src={accentShot.src}
              alt=""
              width={960}
              height={1200}
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-110 object-cover object-center blur-2xl opacity-60"
            />
            <ProgressiveImage
              src={accentShot.src}
              alt={accentShot.alt}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              wrapperClassName="absolute inset-0"
              className="object-cover object-center transition duration-500 group-hover:scale-[1.06]"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent p-4 opacity-0 transition duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
              <p className="max-w-[14ch] font-display text-base font-semibold tracking-[-0.03em] text-white md:text-lg">
                {accentShot.title}
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal variant="featured" amount={0.08} className="mt-10 max-w-2xl lg:mt-14">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">Features</p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.03em] text-balance md:text-4xl lg:text-[2.9rem] lg:leading-[1.02]">
            Built to feel more like jewelry than tech.
          </h2>
          <p className="mt-3 max-w-[34ch] text-base leading-7 text-muted-foreground">
            Sleep, stress, and recovery — surfaced fast, worn quietly.
          </p>
        </Reveal>

        <RevealGroup className="mt-10 grid gap-4 md:grid-cols-3 lg:mt-14">
          {features.map((feature, index) => {
            const Icon = featureIcons[index] ?? Sparkles

            return (
              <Reveal key={feature.title} variant="stagger-item" delay={0.07 * index}>
                <article className="h-full rounded-[1.5rem] border border-border/70 bg-card/35 p-6 backdrop-blur-sm transition-colors hover:border-primary/30">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-5 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                    {feature.eyebrow}
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-semibold tracking-[-0.03em] text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{feature.description}</p>
                </article>
              </Reveal>
            )
          })}
        </RevealGroup>
      </div>
    </section>
  )
}
