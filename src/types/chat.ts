export type ChatRole = 'user' | 'assistant'

export interface ChatTurn {
  role: ChatRole
  content: string
}

export interface ChatLink {
  label: string
  href: string
}

export interface ChatResponse {
  message: string
  suggestions: string[]
  links: ChatLink[]
}

export interface ChatRequest {
  messages: ChatTurn[]
}

export interface ChatClientMessage extends ChatTurn {
  id: string
  timestamp?: number
  links?: ChatLink[]
  suggestions?: string[]
}

export type ChatIntent =
  | 'greeting'
  | 'compare-products'
  | 'show-colors'
  | 'show-sizes'
  | 'sleep-recommendation'
  | 'open-ended'
  | 'out-of-scope'
