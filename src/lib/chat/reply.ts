import { GoogleGenAI } from '@google/genai'
import { z } from 'zod'

import { buildChatCatalogContext, type ChatCatalogContext } from '@/lib/chat/context'
import { siteConfig } from '@/config/site'
import {
  buildGreetingResponse,
  buildOutOfScopeResponse,
  classifyChatIntent,
  detectChatLanguage,
} from '@/lib/chat/guards'
import { buildChatPrompt } from '@/lib/chat/prompt'
import type { ChatIntent, ChatResponse, ChatTurn } from '@/types/chat'

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
const REQUEST_TIMEOUT_MS = 15000

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

type ChatReplySource = 'greeting' | 'local' | 'model' | 'fallback' | 'out-of-scope'

function normalizePromptKey(message: string) {
  return message.toLowerCase().trim().replace(/\s+/g, ' ')
}

function getSafeSuggestions(message: string, exclude?: string) {
  const suggestions = detectChatLanguage(message) === 'vi' ? VIETNAMESE_SUGGESTIONS : ENGLISH_SUGGESTIONS
  const excluded = exclude ? normalizePromptKey(exclude) : null

  return suggestions.filter((suggestion) => normalizePromptKey(suggestion) !== excluded).slice(0, 4)
}

function buildProductsLink(language: 'vi' | 'en') {
  return language === 'vi'
    ? { label: 'Xem tất cả sản phẩm', href: '/products' }
    : { label: 'View all products', href: '/products' }
}

function buildProductLink(language: 'vi' | 'en', slug: string, name: string) {
  return {
    label: language === 'vi' ? `Xem ${name}` : `View ${name}`,
    href: `/products/${slug}`,
  }
}

class ChatProviderError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ChatProviderError'
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

function buildUnavailableFallback(message: string): ChatResponse {
  if (detectChatLanguage(message) === 'vi') {
    return {
      message: 'Aurora Assistant tạm thời chưa phản hồi được. Bạn thử lại sau ít phút nhé.',
      suggestions: getSafeSuggestions(message),
      links: [],
    }
  }

  return {
    message: 'Aurora Assistant is temporarily unavailable right now.',
    suggestions: getSafeSuggestions(message),
    links: [],
  }
}

function buildOpenEndedCatalogReply(input: {
  message: string
  context: ChatCatalogContext
}) {
  const language = detectChatLanguage(input.message)
  const normalized = normalizePromptKey(input.message)
  const products = input.context.products.length ? input.context.products : []

  if (!products.length) {
    return null
  }

  const companyQuestion =
    normalized.includes('company') ||
    normalized.includes('brand') ||
    normalized.includes('about aurora') ||
    normalized.includes('aurora là gì') ||
    normalized.includes('công ty') ||
    normalized.includes('cong ty') ||
    normalized.includes('thương hiệu') ||
    normalized.includes('thuong hieu')

  if (companyQuestion) {
    return {
      message:
        language === 'vi'
          ? `${siteConfig.brand} là thương hiệu nhẫn thông minh tập trung vào theo dõi giấc ngủ, phục hồi, nhịp tim và stress trong thiết kế jewelry-first. Hiện lineup có ${products.map((product) => product.name).join(', ')}.`
          : `${siteConfig.brand} is a smart ring brand focused on sleep, recovery, heart-rate, and stress tracking in a jewelry-first design. The current lineup includes ${products.map((product) => product.name).join(', ')}.`,
      suggestions:
        language === 'vi'
          ? ['Aura Ring có loại nào?', 'Có những màu nào?', 'So sánh Aura Air và Aura Pro']
          : ['What Aura Ring models are available?', 'Show available colors', 'Compare Aura Air and Aura Pro'],
      links: [{ label: language === 'vi' ? 'Xem tất cả sản phẩm' : 'View all products', href: '/products' }],
    } satisfies ChatResponse
  }

  return {
    message:
      language === 'vi'
        ? `Hiện ${siteConfig.brand} có ${products.length} mẫu: ${products.map((product) => `${product.name} (${product.price})`).join(', ')}. ${products.map((product) => `${product.name}: ${product.tagline}`).join(' ')}`
        : `${siteConfig.brand} currently has ${products.length} models: ${products.map((product) => `${product.name} (${product.price})`).join(', ')}. ${products.map((product) => `${product.name}: ${product.tagline}`).join(' ')}`,
    suggestions:
      language === 'vi'
        ? ['So sánh Aura Air và Aura Pro', 'Có những màu nào?', 'Size nào còn hàng?']
        : ['Compare Aura Air and Aura Pro', 'Show available colors', 'Which sizes are in stock?'],
    links: input.context.links.length
      ? input.context.links
      : [{ label: language === 'vi' ? 'Xem tất cả sản phẩm' : 'View all products', href: '/products' }],
  } satisfies ChatResponse
}

function buildLocalCatalogReply(input: {
  message: string
  intent: ChatIntent
  context: ChatCatalogContext
}) {
  const language = detectChatLanguage(input.message)
  const products = input.context.products

  if (!products.length) {
    return null
  }

  if (input.intent === 'show-colors') {
    return {
      message:
        language === 'vi'
          ? products.map((product) => `${product.name} có các màu ${product.colors.join(', ')}.`).join(' ')
          : products.map((product) => `${product.name} comes in ${product.colors.join(', ')}.`).join(' '),
      suggestions: getSafeSuggestions(input.message, language === 'vi' ? 'Có những màu nào?' : 'Show available colors'),
      links: [buildProductsLink(language)],
    } satisfies ChatResponse
  }

  if (input.intent === 'show-sizes') {
    return {
      message:
        language === 'vi'
          ? products.map((product) => `${product.name} còn các size ${product.sizesInStock.join(', ')}.`).join(' ')
          : products.map((product) => `${product.name} has sizes ${product.sizesInStock.join(', ')} in stock.`).join(' '),
      suggestions: getSafeSuggestions(
        input.message,
        language === 'vi' ? 'Size nào còn hàng?' : 'Which sizes are in stock?'
      ),
      links: products.slice(0, 3).map((product) => buildProductLink(language, product.slug, product.name)),
    } satisfies ChatResponse
  }

  if (input.intent === 'compare-products') {
    const auraAir = products.find((product) => product.slug === 'aura-air')
    const auraPro = products.find((product) => product.slug === 'aura-pro')

    if (!auraAir || !auraPro) {
      return null
    }

    return {
      message:
        language === 'vi'
          ? `Aura Air nhẹ hơn và có giá ${auraAir.price}, phù hợp theo dõi phục hồi hằng ngày. Aura Pro có giá ${auraPro.price}, pin ${auraPro.specs.Battery}, chống nước ${auraPro.specs.Water}, hợp hơn nếu bạn muốn theo dõi tập luyện và nhịp tim kỹ hơn.`
          : `Aura Air is lighter and starts at ${auraAir.price}, which fits daily recovery tracking. Aura Pro starts at ${auraPro.price}, adds ${auraPro.specs.Battery} battery life and ${auraPro.specs.Water} water resistance, and suits deeper training and heart-rate tracking better.`,
      suggestions: getSafeSuggestions(
        input.message,
        language === 'vi' ? 'So sánh Aura Air và Aura Pro' : 'Compare Aura Air and Aura Pro'
      ),
      links: [
        buildProductLink(language, auraAir.slug, auraAir.name),
        buildProductLink(language, auraPro.slug, auraPro.name),
      ],
    } satisfies ChatResponse
  }

  if (input.intent === 'sleep-recommendation') {
    const sleepRanked = [...products]
      .filter((product) => product.specs.Battery)
      .sort((left, right) => Number.parseInt(right.specs.Battery, 10) - Number.parseInt(left.specs.Battery, 10))

    const best = sleepRanked[0]

    if (!best) {
      return null
    }

    return {
      message:
        language === 'vi'
          ? `${best.name} hợp nhất nếu bạn ưu tiên theo dõi giấc ngủ vì pin ${best.specs.Battery}, chống nước ${best.specs.Water}, và tagline ${best.tagline.toLowerCase()}`
          : `${best.name} is best if sleep tracking matters most because it offers ${best.specs.Battery} battery life, ${best.specs.Water} water resistance, and ${best.tagline.toLowerCase()}`,
      suggestions: getSafeSuggestions(
        input.message,
        language === 'vi' ? 'Nhẫn nào hợp để theo dõi giấc ngủ?' : 'Which Aura ring fits sleep tracking?'
      ),
      links: [buildProductLink(language, best.slug, best.name)],
    } satisfies ChatResponse
  }

  return null
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

function normalizeGeneratedLinks(links: unknown, fallbackLinks: ChatResponse['links']) {
  if (!Array.isArray(links)) {
    return fallbackLinks
  }

  const normalized = links
    .map((link) => {
      if (!link || typeof link !== 'object') {
        return null
      }

      const item = link as { label?: unknown; href?: unknown; title?: unknown; url?: unknown }
      const label = typeof item.label === 'string' ? item.label : typeof item.title === 'string' ? item.title : ''
      const href = typeof item.href === 'string' ? item.href : typeof item.url === 'string' ? item.url : ''

      if (!label.trim() || !href.startsWith('/')) {
        return null
      }

      return {
        label: label.trim(),
        href,
      }
    })
    .filter((item): item is NonNullable<typeof item> => !!item)
    .slice(0, 3)

  return normalized.length ? normalized : fallbackLinks
}

function normalizeGeneratedPayload(parsedJson: unknown, fallbackLinks: ChatResponse['links']) {
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
    links: normalizeGeneratedLinks(candidate.links, fallbackLinks),
  }
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
  contextLinks: ChatResponse['links']
  parsedJson: unknown
}) {
  const parsed = modelResponseSchema.safeParse(input.parsedJson)

  if (!parsed.success) {
    throw new ChatProviderFormatError()
  }

  return {
    ...parsed.data,
    suggestions: parsed.data.suggestions.length
      ? parsed.data.suggestions
      : detectChatLanguage(input.message) === 'vi'
        ? ['So sánh Aura Air và Aura Pro', 'Có những màu nào?']
        : ['Compare Aura Air and Aura Pro', 'Show available colors'],
    links: parsed.data.links.length ? parsed.data.links : input.contextLinks,
  }
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

    if (error instanceof Error) {
      throw new ChatProviderError(error.message)
    }

    throw error
  }
}

export async function buildChatReply(input: {
  message: string
  history: ChatTurn[]
}): Promise<{
  response: ChatResponse
  status: number
  source: ChatReplySource
}> {
  const intent = classifyChatIntent(input.message)

  console.info('[chat:intent]', {
    message: input.message,
    normalized: normalizePromptKey(input.message),
    intent,
  })

  if (intent === 'greeting') {
    return {
      response: buildGreetingResponse(input.message),
      status: 200,
      source: 'greeting',
    }
  }

  if (intent === 'out-of-scope') {
    return {
      response: buildOutOfScopeResponse(input.message),
      status: 200,
      source: 'out-of-scope',
    }
  }

  const context = buildChatCatalogContext(input.message)
  const localReply = buildLocalCatalogReply({
    message: input.message,
    intent,
    context,
  })

  if (localReply) {
    return {
      response: localReply,
      status: 200,
      source: 'local',
    }
  }

  const openEndedFallback = buildOpenEndedCatalogReply({
    message: input.message,
    context,
  })

  if (openEndedFallback) {
    return {
      response: openEndedFallback,
      status: 200,
      source: 'local',
    }
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim()

  if (!apiKey) {
    return {
      response: buildUnavailableFallback(input.message),
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
    const response = await requestGeminiWithSdk({
      apiKey,
      model: resolveGeminiModel(),
      promptSystem: prompt.system,
      promptUser: prompt.user,
    })

    const parsedJson = normalizeGeneratedPayload(parseSdkResponse(response), context.links)

    return {
      response: finalizeResponse({
        message: input.message,
        contextLinks: context.links,
        parsedJson: typeof parsedJson === 'string' ? parseModelResponse(parsedJson) : parsedJson,
      }),
      status: 200,
      source: 'model',
    }
  } catch (error) {
    return {
      response:
        error instanceof ChatProviderFormatError
          ? buildFormatFallback(input.message, context.links)
          : buildUnavailableFallback(input.message),
      status: error instanceof ChatProviderFormatError ? 502 : 503,
      source: 'fallback',
    }
  }
}
