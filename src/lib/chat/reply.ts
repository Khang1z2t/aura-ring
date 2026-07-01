import { GoogleGenAI } from '@google/genai'
import { z } from 'zod'

import { buildChatCatalogContext } from '@/lib/chat/context'
import {
  buildOutOfScopeResponse,
  buildUnavailableResponse,
  detectChatLanguage,
  isAuroraScopedMessage,
} from '@/lib/chat/guards'
import { buildChatPrompt } from '@/lib/chat/prompt'
import type { ChatResponse, ChatTurn } from '@/types/chat'

const modelResponseSchema = z.object({
  message: z.string().trim().min(1),
  suggestions: z.array(z.string().trim().min(1)).max(4),
  links: z
    .array(
      z.object({
        label: z.string().trim().min(1),
        href: z.string().trim().min(1).regex(/^\//),
      })
    )
    .max(3),
})

const DEFAULT_MODEL = 'gemini-3.5-flash'
// Dùng khi model chính bị quá tải (Gemini hay trả 503 khi model đang đông request)
const FALLBACK_MODEL = 'gemini-2.5-flash'
const REQUEST_TIMEOUT_MS = 15000
const MAX_RETRIES = 2
const RETRY_BASE_DELAY_MS = 400

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

type ChatReplySource = 'guard' | 'model' | 'fallback'

function normalizePromptKey(message: string) {
  return message.toLowerCase().trim().replace(/\s+/g, ' ')
}

function getSafeSuggestions(message: string, exclude?: string) {
  const suggestions = detectChatLanguage(message) === 'vi' ? VIETNAMESE_SUGGESTIONS : ENGLISH_SUGGESTIONS
  const excluded = exclude ? normalizePromptKey(exclude) : null

  return suggestions.filter((suggestion) => normalizePromptKey(suggestion) !== excluded).slice(0, 4)
}

/**
 * Lỗi tạm thời từ phía Gemini (model quá tải, rate limit, mạng chập chờn).
 * Những lỗi này nên được RETRY thay vì trả thẳng lỗi cho user.
 */
class ChatProviderRetryableError extends Error {
  status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ChatProviderRetryableError'
    this.status = status
  }
}

/** Lỗi cấu hình / auth — retry vô ích, cần báo ngay. */
class ChatProviderError extends Error {
  status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ChatProviderError'
    this.status = status
  }
}

class ChatProviderTimeoutError extends Error {
  constructor() {
    super('Gemini request timed out')
    this.name = 'ChatProviderTimeoutError'
  }
}

class ChatProviderFormatError extends Error {
  constructor() {
    super('Gemini response format invalid')
    this.name = 'ChatProviderFormatError'
  }
}

function sanitizeSdkText(text: string | undefined) {
  return typeof text === 'string' ? text.trim() : ''
}

function parseSdkResponse(response: { text?: string; candidates?: unknown[] }) {
  const text = sanitizeSdkText(response.text)

  if (text) {
    return parseModelResponse(text)
  }

  const firstCandidate = Array.isArray(response.candidates) ? response.candidates[0] : null
  const parts =
    firstCandidate &&
    typeof firstCandidate === 'object' &&
    'content' in firstCandidate &&
    firstCandidate.content &&
    typeof firstCandidate.content === 'object' &&
    'parts' in firstCandidate.content &&
    Array.isArray(firstCandidate.content.parts)
      ? firstCandidate.content.parts
      : []

  const aggregatedText = parts
    .map((part) =>
      part && typeof part === 'object' && 'text' in part && typeof part.text === 'string' ? part.text : ''
    )
    .join('')
    .trim()

  if (!aggregatedText) {
    throw new ChatProviderFormatError()
  }

  return parseModelResponse(aggregatedText)
}

function buildFormatFallback(message: string, links: ChatResponse['links']): ChatResponse {
  if (detectChatLanguage(message) === 'vi') {
    return {
      message:
        'Mình có thể hỗ trợ về sản phẩm nhẫn Aurora, nhưng câu trả lời vừa rồi chưa đúng định dạng. Bạn thử lại giúp mình nhé.',
      suggestions: ['So sánh Aura Air và Aura Pro', 'Size nào còn hàng?'],
      links,
    }
  }

  return {
    message:
      'I can help with Aurora ring products, but that answer did not come back in the right format. Please try again.',
    suggestions: ['Compare Aura Air and Aura Pro', 'Which sizes are in stock?'],
    links,
  }
}

function resolveGeminiModel() {
  const model = process.env.GEMINI_MODEL?.trim()

  if (!model || !/^gemini-|^gemma-4-/i.test(model)) {
    return DEFAULT_MODEL
  }

  return model
}

function createGeminiClient(apiKey: string) {
  const baseUrl = process.env.GEMINI_API_URL?.trim()

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      timeout: REQUEST_TIMEOUT_MS,
      ...(baseUrl ? { baseUrl } : {}),
    },
  })
}

function buildResponseSchema() {
  return {
    type: 'OBJECT',
    required: ['message', 'suggestions', 'links'],
    properties: {
      message: {
        type: 'STRING',
      },
      suggestions: {
        type: 'ARRAY',
        items: {
          type: 'STRING',
        },
      },
      links: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          required: ['label', 'href'],
          properties: {
            label: {
              type: 'STRING',
            },
            href: {
              type: 'STRING',
            },
          },
        },
      },
    },
  } as const
}

function normalizeGeneratedLinks(links: unknown, allowedLinks: ChatResponse['links']) {
  if (!Array.isArray(links) || !allowedLinks.length) {
    return allowedLinks
  }

  const allowedByHref = new Map(allowedLinks.map((link) => [link.href, link]))
  const normalized = links
    .map((link) => {
      if (!link || typeof link !== 'object') {
        return null
      }

      const item = link as { label?: unknown; href?: unknown; title?: unknown; url?: unknown }
      const label = typeof item.label === 'string' ? item.label : typeof item.title === 'string' ? item.title : ''
      const href = typeof item.href === 'string' ? item.href : typeof item.url === 'string' ? item.url : ''
      const allowed = allowedByHref.get(href)

      if (!allowed || !href.startsWith('/')) {
        return null
      }

      return {
        label: label.trim() || allowed.label,
        href,
      }
    })
    .filter((item): item is NonNullable<typeof item> => !!item)
    .slice(0, 3)

  return normalized.length ? normalized : allowedLinks
}

function normalizeGeneratedPayload(parsedJson: unknown, allowedLinks: ChatResponse['links']) {
  if (!parsedJson || typeof parsedJson !== 'object') {
    return parsedJson
  }

  const candidate = parsedJson as {
    message?: unknown
    suggestions?: unknown
    links?: unknown
  }

  return {
    message: candidate.message,
    suggestions: candidate.suggestions,
    links: normalizeGeneratedLinks(candidate.links, allowedLinks),
  }
}

function filterAllowedSuggestions(message: string, history: ChatTurn[], suggestions: string[]) {
  const safeSuggestions = suggestions
    .map((suggestion) => suggestion.trim())
    .filter(Boolean)
    .filter((suggestion) => isAuroraScopedMessage(suggestion, history))
    .slice(0, 4)

  return safeSuggestions.length ? safeSuggestions : getSafeSuggestions(message)
}

function clampAssistantMessage(message: string) {
  return message.replace(/\s+/g, ' ').trim()
}

function parseModelResponse(text: string) {
  const firstBrace = text.indexOf('{')
  const lastBrace = text.lastIndexOf('}')
  const candidate = firstBrace >= 0 && lastBrace > firstBrace ? text.slice(firstBrace, lastBrace + 1) : text

  try {
    return JSON.parse(candidate)
  } catch {
    throw new ChatProviderFormatError()
  }
}

function finalizeResponse(input: {
  message: string
  history: ChatTurn[]
  contextLinks: ChatResponse['links']
  parsedJson: unknown
}) {
  const parsed = modelResponseSchema.safeParse(input.parsedJson)

  if (!parsed.success) {
    throw new ChatProviderFormatError()
  }

  return {
    ...parsed.data,
    message: clampAssistantMessage(parsed.data.message),
    suggestions: filterAllowedSuggestions(input.message, input.history, parsed.data.suggestions),
    links: parsed.data.links.length ? parsed.data.links : input.contextLinks,
  }
}

/**
 * Cố gắng đọc HTTP status thật từ lỗi do SDK ném ra.
 * @google/genai thường đính kèm status trong `error.status` hoặc trong message dạng "[503 ...]".
 */
function extractStatusCode(error: unknown): number | undefined {
  if (error && typeof error === 'object') {
    const withStatus = error as { status?: unknown; code?: unknown }
    if (typeof withStatus.status === 'number') return withStatus.status
    if (typeof withStatus.code === 'number') return withStatus.code
  }

  if (error instanceof Error) {
    const match = error.message.match(/\b(429|500|503)\b/)
    if (match) return Number(match[1])
  }

  return undefined
}

function isRetryableStatus(status: number | undefined) {
  return status === 429 || status === 500 || status === 503
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function requestGeminiWithSdk(input: {
  apiKey: string
  model: string
  promptSystem: string
  promptUser: string
}) {
  try {
    const ai = createGeminiClient(input.apiKey)

    return await ai.models.generateContent({
      model: input.model,
      contents: input.promptUser,
      config: {
        systemInstruction: input.promptSystem,
        responseMimeType: 'application/json',
        responseSchema: buildResponseSchema(),
        maxOutputTokens: 500,
        temperature: 0.4,
      },
    })
  } catch (error) {
    if (error instanceof Error && /abort|timed out|timeout/i.test(error.message)) {
      throw new ChatProviderTimeoutError()
    }

    const status = extractStatusCode(error)
    const message = error instanceof Error ? error.message : String(error)

    if (isRetryableStatus(status)) {
      throw new ChatProviderRetryableError(message, status)
    }

    throw new ChatProviderError(message, status)
  }
}

/**
 * Gọi Gemini với retry cho lỗi tạm thời (model overloaded / rate limit / lỗi mạng),
 * có backoff tăng dần và, ở lần thử cuối, chuyển sang FALLBACK_MODEL nếu khác model chính.
 */
async function requestGeminiWithRetry(input: {
  apiKey: string
  model: string
  promptSystem: string
  promptUser: string
}) {
  let lastError: unknown

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    // Ở lần thử cuối cùng, nếu model chính khác model fallback thì đổi model
    const useFallbackModel = attempt === MAX_RETRIES && input.model !== FALLBACK_MODEL
    const model = useFallbackModel ? FALLBACK_MODEL : input.model

    try {
      return await requestGeminiWithSdk({ ...input, model })
    } catch (error) {
      lastError = error

      const isRetryable =
        error instanceof ChatProviderRetryableError || error instanceof ChatProviderTimeoutError

      console.error(
        `[gemini-chat] attempt ${attempt + 1}/${MAX_RETRIES + 1} failed (model=${model}):`,
        error instanceof Error ? error.message : error
      )

      if (!isRetryable || attempt === MAX_RETRIES) {
        throw error
      }

      await sleep(RETRY_BASE_DELAY_MS * 2 ** attempt)
    }
  }

  // Không bao giờ chạy tới đây, nhưng TypeScript cần một throw cuối
  throw lastError
}

export async function buildChatReply(input: {
  message: string
  history: ChatTurn[]
}): Promise<{
  response: ChatResponse
  status: number
  source: ChatReplySource
}> {
  if (!isAuroraScopedMessage(input.message, input.history)) {
    return {
      response: buildOutOfScopeResponse(input.message),
      status: 200,
      source: 'guard',
    }
  }

  const context = buildChatCatalogContext({
    message: input.message,
    history: input.history,
  })
  const apiKey = process.env.GEMINI_API_KEY?.trim()

  if (!apiKey) {
    console.error('[gemini-chat] Missing GEMINI_API_KEY env var')
    return {
      response: buildUnavailableResponse(input.message),
      status: 503,
      source: 'fallback',
    }
  }

  const prompt = buildChatPrompt({
    message: input.message,
    history: input.history,
    context,
  })

  try {
    const response = await requestGeminiWithRetry({
      apiKey,
      model: resolveGeminiModel(),
      promptSystem: prompt.system,
      promptUser: prompt.user,
    })

    const parsedJson = normalizeGeneratedPayload(parseSdkResponse(response), context.links)

    return {
      response: finalizeResponse({
        message: input.message,
        history: input.history,
        contextLinks: context.links,
        parsedJson: typeof parsedJson === 'string' ? parseModelResponse(parsedJson) : parsedJson,
      }),
      status: 200,
      source: 'model',
    }
  } catch (error) {
    // Log đầy đủ để debug trên server — đây là phần code cũ bị thiếu hoàn toàn
    console.error('[gemini-chat] Final failure:', {
      name: error instanceof Error ? error.name : 'unknown',
      message: error instanceof Error ? error.message : String(error),
      status: extractStatusCode(error),
    })

    if (error instanceof ChatProviderFormatError) {
      return {
        response: buildFormatFallback(input.message, context.links),
        status: 502,
        source: 'fallback',
      }
    }

    // ChatProviderError (auth/config) hoặc hết retry cho lỗi tạm thời -> báo user thử lại
    return {
      response: buildUnavailableResponse(input.message),
      status: 503,
      source: 'fallback',
    }
  }
}