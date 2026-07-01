'use client'

import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion'

interface RevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
  variant?: 'fade' | 'featured' | 'stagger-item'
  once?: boolean
  amount?: number
}

const variantMap = {
  fade: {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0 },
  },
  featured: {
    hidden: { opacity: 0, y: 44, scale: 0.965 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
  'stagger-item': {
    hidden: { opacity: 0, y: 24, scale: 0.985 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
} as const

export function Reveal({
  children,
  delay = 0,
  className,
  variant = 'fade',
  once = true,
  amount = 0.2,
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion()

  const motionVariants = prefersReducedMotion
    ? {
        hidden: { opacity: 1, y: 0, scale: 1 },
        visible: { opacity: 1, y: 0, scale: 1 },
      }
    : variantMap[variant]

  const hiddenState = variantMap[variant].hidden
  const initialStyle = prefersReducedMotion
    ? undefined
    : {
        opacity: hiddenState.opacity,
        transform: `translateY(${hiddenState.y}px)${'scale' in hiddenState ? ` scale(${hiddenState.scale})` : ''}`,
      }

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className={className}
        style={initialStyle}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount }}
        variants={motionVariants}
        transition={{
          duration: variant === 'featured' ? 0.68 : variant === 'stagger-item' ? 0.56 : 0.45,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </m.div>
    </LazyMotion>
  )
}
