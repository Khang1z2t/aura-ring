'use client'

import { useEffect } from 'react'

import { useCartStore } from '@/store/useCartStore'
import { useChatStore } from '@/store/useChatStore'
import { useThemeStore } from '@/store/useThemeStore'

interface ThemeProviderProps {
  children: React.ReactNode
}

function applyTheme(theme: 'dark' | 'light') {
  const isLight = theme === 'light'
  document.documentElement.classList.toggle('light', isLight)
  document.documentElement.style.colorScheme = isLight ? 'light' : 'dark'
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useThemeStore((state) => state.theme)

  useEffect(() => {
    void Promise.resolve(useThemeStore.persist.rehydrate()).then(() => {
      applyTheme(useThemeStore.getState().theme)
    })

    void useCartStore.persist.rehydrate()
    void useChatStore.persist.rehydrate()
  }, [])

  useEffect(() => {
    if (!useThemeStore.persist.hasHydrated()) {
      return
    }

    applyTheme(theme)
  }, [theme])

  return children
}
