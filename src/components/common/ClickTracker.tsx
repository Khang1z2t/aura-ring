'use client'

import { useEffect } from 'react'

import { trackClick } from '@/lib/tracking/client'

function clickTarget(el: HTMLElement): string {
  return (
    el.dataset.track ??
    el.closest('[data-track]')?.getAttribute('data-track') ??
    el.ariaLabel ??
    el.tagName.toLowerCase()
  )
}

export function ClickTracker() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      if (!el) return
      void trackClick(clickTarget(el))
    }

    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  return null
}
