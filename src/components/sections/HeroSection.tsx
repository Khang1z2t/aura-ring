'use client'

import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import gsap from 'gsap'

import { ProgressiveImage } from '@/components/common/ProgressiveImage'

const heroStats = [
  { value: '7 days', label: 'Battery life' },
  { value: '150m', label: 'Water resist' },
  { value: '12+', label: 'Health metrics' },
] as const

export function HeroSection() {
  const rootRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const visualRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const scrollCueRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const root = rootRef.current
    const content = contentRef.current
    const visual = visualRef.current
    const glow = glowRef.current
    const scrollCue = scrollCueRef.current

    if (!root || !content || !visual || !glow || !scrollCue || prefersReducedMotion) {
      return
    }

    let frame = 0

    const ctx = gsap.context(() => {
      const badges = root.querySelector('[data-hero-badges]')
      const lineOne = root.querySelector('[data-hero-line="1"]')
      const lineTwo = root.querySelector('[data-hero-line="2"]')
      const copy = root.querySelector('[data-hero-copy]')
      const actions = root.querySelector('[data-hero-actions]')
      const stats = root.querySelectorAll('[data-hero-stat]')

      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })

      timeline
        .from(badges, { y: 16, opacity: 0, duration: 0.42 })
        .from(lineOne, { y: 28, opacity: 0, duration: 0.5 }, '-=0.18')
        .from(lineTwo, { y: 34, opacity: 0, duration: 0.56 }, '-=0.3')
        .from(copy, { y: 20, opacity: 0, duration: 0.42 }, '-=0.26')
        .from(actions, { y: 20, opacity: 0, duration: 0.42 }, '-=0.22')
        .from(stats, { y: 18, opacity: 0, duration: 0.34, stagger: 0.08 }, '-=0.18')
        .from(
          visual,
          { y: 34, scale: 0.965, opacity: 0, duration: 0.64 },
          0.12
        )
        .from(glow, { scale: 0.88, opacity: 0, duration: 0.72 }, 0.08)
        .from(scrollCue, { y: 10, opacity: 0, duration: 0.32 }, '-=0.14')

      const setContentY = gsap.quickSetter(content, 'y', 'px')
      const setVisualY = gsap.quickSetter(visual, 'y', 'px')
      const setVisualScale = gsap.quickSetter(visual, 'scale')
      const setGlowScale = gsap.quickSetter(glow, 'scale')
      const setGlowOpacity = gsap.quickSetter(glow, 'opacity')
      const setCueY = gsap.quickSetter(scrollCue, 'y', 'px')
      const setCueOpacity = gsap.quickSetter(scrollCue, 'opacity')

      const updateScrollState = () => {
        frame = 0

        const progress = Math.min(window.scrollY / 120, 1)

        setContentY(progress * -18)
        setVisualY(progress * 14)
        setVisualScale(1 - progress * 0.025)
        setGlowScale(1 - progress * 0.06)
        setGlowOpacity(1 - progress * 0.35)
        setCueY(progress * 14)
        setCueOpacity(1 - progress * 1.6)
      }

      const onScroll = () => {
        if (frame) {
          return
        }

        frame = window.requestAnimationFrame(updateScrollState)
      }

      updateScrollState()
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onScroll)

      return () => {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onScroll)

        if (frame) {
          window.cancelAnimationFrame(frame)
        }
      }
    }, root)

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame)
      }

      ctx.revert()
    }
  }, [prefersReducedMotion])

  return (
    <section ref={rootRef} className="relative overflow-hidden px-4 py-20 md:px-8 md:py-28 lg:px-0 lg:py-0">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(200,169,106,0.1)_0%,rgba(212,197,176,0.05)_42%,transparent_72%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center gap-12 lg:flex-row lg:items-center lg:gap-16">
        <div ref={contentRef} className="max-w-xl lg:mx-auto lg:w-full lg:max-w-[34rem]">
          <div data-hero-badges className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-primary">
              New · 2026
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Aurora Ring
            </span>
          </div>

          <h1 className="mt-6 pr-2 font-display text-5xl font-semibold leading-[0.92] tracking-[-0.04em] text-balance md:pr-0 md:text-6xl lg:text-7xl">
            <span data-hero-line="1" className="block">
              Health.
            </span>
            <span
              data-hero-line="2"
              className="block bg-gradient-to-r from-ember via-amber to-ember bg-clip-text text-transparent"
            >
              On Your Finger.
            </span>
          </h1>

          <p data-hero-copy className="mt-6 max-w-lg text-lg leading-7 text-muted-foreground md:text-xl">
            Track sleep, heart rate, SpO₂, stress — all day, all night. No screen. No
            distraction. Just data that matters.
          </p>

          <div data-hero-actions className="mt-8 flex flex-col gap-3 pr-2 sm:flex-row sm:items-center sm:pr-0">
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

          <div className="mt-10 grid grid-cols-1 gap-3 border-t border-border/70 pt-6 sm:grid-cols-3 sm:gap-6">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                data-hero-stat
                className="flex items-center justify-between rounded-2xl border border-border/70 bg-card/35 px-4 py-3 backdrop-blur-sm sm:block sm:space-y-1 sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:pr-4 sm:backdrop-blur-none"
              >
                <p className="font-mono text-xl text-foreground sm:text-2xl">{stat.value}</p>
                <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground sm:text-xs sm:tracking-[0.18em]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div ref={visualRef} data-hero-visual className="relative flex flex-1 items-center justify-center lg:w-1/2">
          <div
            ref={glowRef}
            data-hero-glow
            className="absolute h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(255,107,53,0.24)_0%,rgba(255,179,71,0.12)_35%,transparent_72%)] blur-2xl md:h-80 md:w-80 lg:h-96 lg:w-96"
          />
          <ProgressiveImage
            src="/images/rings/aura_ring_elite.webp"
            alt="Aurora Ring hero product render"
            width={960}
            height={960}
            priority
            wrapperClassName="relative"
            className="relative w-[280px] object-contain drop-shadow-[0_0_48px_rgba(255,107,53,0.18)] md:w-[360px] lg:w-[480px]"
          />
        </div>
      </div>

      <div
        ref={scrollCueRef}
        data-hero-scroll-cue
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground md:flex"
      >
        <span>Scroll</span>
        <ChevronDown className="h-4 w-4" />
      </div>
    </section>
  )
}
