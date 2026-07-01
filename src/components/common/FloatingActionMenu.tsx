'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUp, Menu, MessageCircle, Moon, SendHorizonal, Sun, X } from 'lucide-react'

import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import { useChatStore } from '@/store/useChatStore'
import { useThemeStore } from '@/store/useThemeStore'
import type { ChatClientMessage, ChatRequest, ChatResponse } from '@/types/chat'

const ENGLISH_SUGGESTIONS = [
  'Compare Aura Air and Aura Pro',
  'Which Aura ring fits sleep tracking?',
  'Show available colors',
  'Which sizes are in stock?',
] as const

const VIETNAMESE_SUGGESTIONS = [
  'So sánh Aura Air và Aura Pro',
  'Nhẫn nào hợp để theo dõi giấc ngủ?',
  'Có những màu nào?',
  'Size nào còn hàng?',
] as const

const FALLBACK_ERROR = 'Aurora Assistant is temporarily unavailable right now.'
const THINKING_LABEL = 'Aurora Assistant is thinking...'

function detectInputLanguage(message: string) {
  const normalized = message.toLowerCase()

  if (/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(normalized)) {
    return 'vi' as const
  }

  if (
    ['xin chào', 'chào', 'giúp', 'tư vấn', 'nhẫn', 'màu', 'giá', 'giỏ hàng', 'so sánh', 'kích cỡ'].some(
      (keyword) => normalized.includes(keyword)
    )
  ) {
    return 'vi' as const
  }

  return 'en' as const
}

function getSeedSuggestions(language: 'vi' | 'en') {
  return language === 'vi' ? [...VIETNAMESE_SUGGESTIONS] : [...ENGLISH_SUGGESTIONS]
}

function getChatPlaceholder(language: 'vi' | 'en') {
  return language === 'vi'
    ? 'Hỏi về size, màu, thông số hoặc so sánh sản phẩm'
    : 'Ask about sizes, colors, specs, or compare models'
}

function getAssistantDescription(language: 'vi' | 'en') {
  return language === 'vi'
    ? 'Hỏi về dòng nhẫn, màu sắc, kích cỡ, thông số, giá hoặc liên kết sản phẩm.'
    : 'Ask about models, colors, sizes, specs, pricing, or product links.'
}

function getThinkingLabel(language: 'vi' | 'en') {
  return language === 'vi' ? 'Aurora Assistant đang trả lời...' : THINKING_LABEL
}

function getFallbackError(language: 'vi' | 'en') {
  return language === 'vi'
    ? 'Aurora Assistant tạm thời chưa phản hồi được.'
    : FALLBACK_ERROR
}

function getInitialLanguage() {
  return 'en' as const
}

function pickResponseLanguage(messages: ChatClientMessage[]) {
  const latestUserMessage = [...messages].reverse().find((message) => message.role === 'user')

  return latestUserMessage ? detectInputLanguage(latestUserMessage.content) : getInitialLanguage()
}

function getPanelLanguage(messages: ChatClientMessage[]) {
  return pickResponseLanguage(messages)
}

function getMessageFallbackSuggestions(
  suggestions: ChatClientMessage['suggestions'],
  language: 'vi' | 'en'
) {
  return suggestions?.length ? suggestions : getSeedSuggestions(language)
}

export function FloatingActionMenu() {
  const [isPinnedOpen, setIsPinnedOpen] = useState(false)
  const [isHoverOpen, setIsHoverOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [shouldRestoreChat, setShouldRestoreChat] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const messages = useChatStore((state) => state.messages)
  const inputValue = useChatStore((state) => state.inputValue)
  const chatError = useChatStore((state) => state.chatError)
  const setInputValue = useChatStore((state) => state.setInputValue)
  const setChatError = useChatStore((state) => state.setChatError)
  const appendMessage = useChatStore((state) => state.appendMessage)
  const messagesContainerRef = useRef<HTMLDivElement | null>(null)
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const canHover = useMediaQuery('(hover: hover) and (pointer: fine)')
  const panelLanguage = useMemo(() => getPanelLanguage(messages), [messages])

  const isExpanded = useMemo(() => isPinnedOpen || isHoverOpen, [isHoverOpen, isPinnedOpen])

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 240)

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    messagesContainerRef.current?.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, isSending])

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

  async function handleSend(messageText: string) {
    const trimmed = messageText.trim()

    if (!trimmed || isSending) {
      return
    }

    const responseLanguage = detectInputLanguage(trimmed)
    const nextUserMessage: ChatClientMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
    }

    const requestMessages = [...messages, nextUserMessage].map(({ role, content }) => ({ role, content }))

    appendMessage(nextUserMessage)
    setInputValue('')
    setIsSending(true)
    setChatError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: requestMessages,
        } satisfies ChatRequest),
      })

      const data = (await response.json().catch(() => null)) as Partial<ChatResponse> | null
      const assistantMessage: ChatClientMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content:
          typeof data?.message === 'string' && data.message.trim().length > 0
            ? data.message
            : getFallbackError(responseLanguage),
        suggestions: Array.isArray(data?.suggestions)
          ? data.suggestions.filter(
              (suggestion): suggestion is string =>
                typeof suggestion === 'string' && suggestion.trim().length > 0
            )
          : getSeedSuggestions(responseLanguage),
        links: Array.isArray(data?.links)
          ? data.links.filter(
              (link): link is NonNullable<ChatClientMessage['links']>[number] =>
                !!link &&
                typeof link.label === 'string' &&
                link.label.trim().length > 0 &&
                typeof link.href === 'string' &&
                link.href.startsWith('/')
            )
          : [],
      }

      appendMessage({
        ...assistantMessage,
        suggestions: getMessageFallbackSuggestions(assistantMessage.suggestions, responseLanguage),
      })

      if (!response.ok && response.status >= 500) {
        setChatError(getFallbackError(responseLanguage))
      }
    } catch {
      setChatError(getFallbackError(responseLanguage))
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex items-end gap-3 md:right-6 md:bottom-6">
      <div
        className={cn(
          'pointer-events-auto flex max-h-[min(38rem,calc(100dvh-7rem))] w-72 max-w-[calc(100vw-5.5rem)] flex-col rounded-3xl border border-border bg-card p-4 text-card-foreground shadow-2xl transition-all duration-200 md:w-96 md:max-w-md',
          isChatOpen
            ? 'pointer-events-auto translate-x-0 opacity-100'
            : 'pointer-events-none translate-x-2 opacity-0'
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Aurora Assistant</p>
            <p className="mt-1 text-sm text-muted-foreground">{getAssistantDescription(panelLanguage)}</p>
          </div>
          <div className="rounded-full bg-primary/10 p-2 text-primary">
            <MessageCircle className="h-4 w-4" />
          </div>
        </div>

        <div ref={messagesContainerRef} className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
          {messages.map((message) => (
            <div key={message.id}>
              <div
                className={cn(
                  'max-w-[85%] rounded-2xl px-3 py-2 text-sm',
                  message.role === 'assistant'
                    ? 'rounded-bl-md border border-border bg-background text-muted-foreground'
                    : 'ml-auto rounded-br-md bg-primary/10 text-foreground'
                )}
              >
                {message.content}
              </div>

              {message.role === 'assistant' && message.links?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {message.links.map((link) => (
                    <Link
                      key={`${message.id}-${link.href}`}
                      href={link.href}
                      className="inline-flex rounded-full border border-border px-3 py-1.5 text-xs text-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              ) : null}

              {message.role === 'assistant' && message.suggestions?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {message.suggestions.map((suggestion) => (
                    <button
                      key={`${message.id}-${suggestion}`}
                      type="button"
                      onClick={() => void handleSend(suggestion)}
                      disabled={isSending}
                      className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-60"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ))}

          {isSending ? (
            <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
              {getThinkingLabel(panelLanguage)}
            </div>
          ) : null}

          {chatError ? (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {chatError}
            </div>
          ) : null}
        </div>

        <form
          className="mt-4 flex items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault()
            void handleSend(inputValue)
          }}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder={getChatPlaceholder(panelLanguage)}
            className="h-11 flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none"
          />
          <button
            type="submit"
            disabled={isSending || inputValue.trim().length === 0}
            aria-label="Send message"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-60"
          >
            <SendHorizonal className="h-4 w-4" />
          </button>
        </form>
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
