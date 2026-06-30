import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

const heroStats = [
  { value: '7 days', label: 'Battery life' },
  { value: '150m', label: 'Water resist' },
  { value: '12+', label: 'Health metrics' },
] as const

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 py-20 md:px-8 md:py-28 lg:px-0 lg:py-0">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(200,169,106,0.1)_0%,rgba(212,197,176,0.05)_42%,transparent_72%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center gap-12 lg:flex-row lg:items-center lg:gap-16">
        <div className="max-w-xl lg:mx-auto lg:w-full lg:max-w-[34rem]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-primary">
              New · 2026
            </span>
            <span className="rounded-full border border-border-strong px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Aurora Ring
            </span>
          </div>

          <h1 className="mt-6 font-display text-5xl font-semibold tracking-[-0.03em] md:text-6xl lg:text-7xl">
            <span className="block">Health.</span>
            <span className="block bg-gradient-to-r from-ember via-amber to-ember bg-clip-text text-transparent">
              On Your Finger.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-7 text-muted-foreground md:text-xl">
            Track sleep, heart rate, SpO₂, stress — all day, all night. No screen. No
            distraction. Just data that matters.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/products"
              className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-br from-ember to-amber px-6 text-sm font-medium text-white transition duration-150 hover:brightness-110"
            >
              Shop Rings
            </Link>
            <a
              href="#features"
              className="inline-flex h-11 items-center justify-center rounded-full border border-border-strong px-6 text-sm font-medium text-foreground transition duration-150 hover:border-primary hover:text-primary"
            >
              See Features ↓
            </a>
          </div>

          <div className="mt-10 w-full rounded-2xl border border-border/80 bg-card/40 p-4 sm:p-5">
            <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {heroStats.map((stat) => (
                <div key={stat.label} className="flex min-h-24 flex-col items-center justify-center py-3 text-center sm:px-4">
                  <p className="font-mono text-2xl text-foreground">{stat.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative flex flex-1 items-center justify-center lg:w-1/2">
          <div className="absolute h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(255,107,53,0.24)_0%,rgba(255,179,71,0.12)_35%,transparent_72%)] blur-2xl md:h-80 md:w-80 lg:h-96 lg:w-96" />
          <Image
            src="/images/rings/aura_ring_elite.webp"
            alt="Aurora Ring hero product render"
            width={960}
            height={960}
            priority
            className="relative w-[280px] object-contain drop-shadow-[0_0_48px_rgba(255,107,53,0.18)] md:w-[360px] lg:w-[480px]"
          />
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground md:flex">
        <span>Scroll</span>
        <ChevronDown className="h-4 w-4" />
      </div>
    </section>
  )
}
