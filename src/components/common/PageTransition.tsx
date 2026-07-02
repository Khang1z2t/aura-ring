'use client'

import { useEffect } from 'react'
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion'
import { usePathname } from 'next/navigation'

import { useMediaQuery } from '@/hooks/useMediaQuery'

interface PageTransitionProps {
  children: React.ReactNode
}

function isScopedRoute(pathname: string) {
  return pathname === '/' || pathname === '/products' || pathname === '/cart' || pathname.startsWith('/products/')
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()
  const isMobile = useMediaQuery('(max-width: 767px)')

  useEffect(() => {
    if (!isScopedRoute(pathname) || window.location.hash) {
      return
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  if (!isScopedRoute(pathname)) {
    return children
  }

  const initial = prefersReducedMotion ? { opacity: 1 } : isMobile ? { opacity: 0.96 } : { opacity: 0, y: 12 }
  const animate = prefersReducedMotion ? { opacity: 1 } : isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }
  const exit = prefersReducedMotion ? { opacity: 1 } : isMobile ? { opacity: 1 } : { opacity: 0, y: -10 }
  const transition = isMobile
    ? { duration: 0.12, ease: 'linear' as const }
    : { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const }

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence mode="wait" initial={false}>
        <m.div key={pathname} initial={initial} animate={animate} exit={exit} transition={transition}>
          {children}
        </m.div>
      </AnimatePresence>
    </LazyMotion>
  )
}
