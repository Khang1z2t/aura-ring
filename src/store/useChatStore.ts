'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { ChatClientMessage } from '@/types/chat'

const ENGLISH_SUGGESTIONS = [
  'Compare Aura Air and Aura Pro',
  'Which Aura ring fits sleep tracking?',
  'Show available colors',
  'Which sizes are in stock?',
] as const

const WELCOME_MESSAGE: ChatClientMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Hello, I am Aurora Assistant. I can help with Aura health ring models, colors, sizes, pricing, specs, and product links.',
  suggestions: [...ENGLISH_SUGGESTIONS],
  links: [],
}

const INITIAL_MESSAGES = [WELCOME_MESSAGE]

interface ChatState {
  messages: ChatClientMessage[]
  inputValue: string
  chatError: string | null
  setInputValue: (value: string) => void
  setChatError: (value: string | null) => void
  appendMessage: (message: ChatClientMessage) => void
  resetChat: () => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: INITIAL_MESSAGES,
      inputValue: '',
      chatError: null,
      setInputValue: (inputValue) => set({ inputValue }),
      setChatError: (chatError) => set({ chatError }),
      appendMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),
      resetChat: () =>
        set({
          messages: INITIAL_MESSAGES,
          inputValue: '',
          chatError: null,
        }),
    }),
    {
      name: 'aurora-chat-session',
      storage: createJSONStorage(() => sessionStorage),
      skipHydration: true,
    }
  )
)
