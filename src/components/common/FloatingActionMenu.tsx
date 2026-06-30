'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowUp, Menu, MessageCircle, Moon, SendHorizonal, Sun, X } from 'lucide-react'

import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import { useThemeStore } from '@/store/useThemeStore'

export function FloatingActionMenu() {
  const [isPinnedOpen, setIsPinnedOpen] = useState(false)
  const [isHoverOpen, setIsHoverOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [shouldRestoreChat, setShouldRestoreChat] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const canHover = useMediaQuery('(hover: hover) and (pointer: fine)')

  const isExpanded = useMemo(
    () => isPinnedOpen || isHoverOpen,
    [isHoverOpen, isPinnedOpen]
  )

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 240)

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMenu = () => {
    setShouldRestoreChat(isChatOpen)
    setIsPinnedOpen(false)
    setIsHoverOpen(false)
    setIsChatOpen(false)
  }

  const handleMainToggle = () => {
    if (isPinnedOpen || isHoverOpen) {
      closeMenu()
      return
    }

    setIsPinnedOpen(true)
    setIsChatOpen(shouldRestoreChat)
  }

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    closeMenu()
  }

  const handleChatToggle = () => {
    setIsPinnedOpen(true)
    setIsChatOpen((current) => {
      const next = !current
      setShouldRestoreChat(next)
      return next
    })
  }

  const handleThemeToggle = () => {
    toggleTheme()
  }

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex items-end gap-3 md:right-6 md:bottom-6">
      <div
        className={cn(
          'pointer-events-auto w-72 max-w-[calc(100vw-5.5rem)] rounded-3xl border border-border bg-card p-4 text-card-foreground shadow-2xl transition-all duration-200 md:w-80 md:max-w-sm',
          isChatOpen
            ? 'pointer-events-auto translate-x-0 opacity-100'
            : 'pointer-events-none translate-x-2 opacity-0'
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Aurora Assistant</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Placeholder chat panel for the upcoming product assistant.
            </p>
          </div>
          <div className="rounded-full bg-primary/10 p-2 text-primary">
            <MessageCircle className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-4 space-y-3 text-sm">
          <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-border bg-background px-3 py-2 text-muted-foreground">
            Hi, I am a placeholder panel for the future Aurora chat flow.
          </div>
          <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-primary/10 px-3 py-2">
            Real chat wiring will be added later.
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <input
            type="text"
            placeholder="Chat coming soon"
            disabled
            className="h-11 flex-1 rounded-full border border-border bg-background px-4 text-sm text-muted-foreground outline-none"
          />
          <button
            type="button"
            disabled
            aria-label="Send placeholder message"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-60"
          >
            <SendHorizonal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        className="pointer-events-auto flex flex-col items-end gap-2"
        onMouseEnter={() => {
          if (!canHover || isPinnedOpen) return
          setIsHoverOpen(true)
          setIsChatOpen(shouldRestoreChat)
        }}
        onMouseLeave={() => {
          if (!canHover || isPinnedOpen) return
          setIsHoverOpen(false)
          setIsChatOpen(false)
        }}
      >
        <div
          className={cn(
            'flex flex-col items-end gap-2 transition-all duration-200',
            isExpanded
              ? 'pointer-events-auto translate-y-0 opacity-100'
              : 'pointer-events-none translate-y-3 opacity-0'
          )}
        >
          {showBackToTop ? (
            <button
              type="button"
              aria-label="Back to top"
              onClick={handleBackToTop}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-card-foreground shadow-lg transition-colors hover:border-primary hover:text-primary"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          ) : null}

          <button
            type="button"
            aria-label="Toggle theme"
            onClick={handleThemeToggle}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-card-foreground shadow-lg transition-colors hover:border-primary hover:text-primary"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            type="button"
            aria-label="Toggle chat"
            onClick={handleChatToggle}
            className={cn(
              'inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card shadow-lg transition-colors hover:border-primary hover:text-primary',
              isChatOpen ? 'text-primary' : 'text-card-foreground'
            )}
          >
            <MessageCircle className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          aria-label={isExpanded ? 'Close quick actions' : 'Open quick actions'}
          aria-expanded={isExpanded}
          onClick={handleMainToggle}
          className={cn(
            'relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card shadow-lg transition-all duration-200 hover:border-primary hover:text-primary',
            isExpanded ? 'border-primary bg-primary/10 text-primary' : 'text-card-foreground'
          )}
        >
          <Menu
            className={cn(
              'absolute h-5 w-5 transition-all duration-200',
              isExpanded ? 'scale-75 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
            )}
          />
          <X
            className={cn(
              'absolute h-5 w-5 transition-all duration-200',
              isExpanded ? 'scale-100 rotate-0 opacity-100' : 'scale-75 -rotate-90 opacity-0'
            )}
          />
        </button>
      </div>
    </div>
  )
}
