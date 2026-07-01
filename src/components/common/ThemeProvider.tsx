'use client'

import { useEffect } from 'react'

import { useCartStore } from '@/store/useCartStore'
import { useThemeStore } from '@/store/useThemeStore'

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useThemeStore((state) => state.theme)

  useEffect(() => {
    useThemeStore.persist.rehydrate()
    useCartStore.persist.rehydrate()
  }, [])

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(theme)
  }, [theme])

  return children
}
