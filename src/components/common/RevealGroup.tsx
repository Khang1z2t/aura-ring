'use client'

import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion'

interface RevealGroupProps {
  children: React.ReactNode
  className?: string
  delay?: number
  containerRef?: React.Ref<HTMLDivElement>
}

export function RevealGroup({ children, className, delay = 0, containerRef }: RevealGroupProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        ref={containerRef}
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.14 }}
        variants={
          prefersReducedMotion
            ? {
                hidden: {},
                visible: {},
              }
            : {
                hidden: {},
                visible: {
                  transition: {
                    delayChildren: delay,
                    staggerChildren: 0.07,
                  },
                },
              }
        }
      >
        {children}
      </m.div>
    </LazyMotion>
  )
}
