export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
} as const

export const gsapDefaults = {
  ease: 'power3.out',
  duration: 0.8,
} as const
