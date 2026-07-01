import { products } from '@/data/products'
import { siteConfig } from '@/config/site'
import type { ChatResponse, ChatTurn } from '@/types/chat'

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

const VIETNAMESE_HINTS = ['xin chào', 'chào', 'giúp', 'tư vấn', 'nhẫn', 'màu', 'giá', 'giấc ngủ'] as const
const GREETING_KEYWORDS = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'xin chào', 'chào'] as const
const AURORA_TERMS = ['aurora', 'aura ring', 'aurora ring', 'smart ring', 'health ring', 'nhẫn thông minh', 'nhẫn sức khỏe']
const SHOPPING_TERMS = [
  'compare',
  'difference',
  'price',
  'pricing',
  'buy',
  'shop',
  'cart',
  'size',
  'sizes',
  'color',
  'colors',
  'spec',
  'specs',
  'feature',
  'features',
  'battery',
  'weight',
  'material',
  'water',
  'sensor',
  'connectivity',
  'compatibility',
  'bluetooth',
  'ios',
  'android',
  'sleep',
  'stress',
  'recovery',
  'heart rate',
  'stock',
  'available',
  'which one',
  'lighter',
  'better',
  'best',
  'company',
  'brand',
  'about',
  'giá',
  'gia',
  'màu',
  'mau',
  'size nào',
  'kích cỡ',
  'kích thước',
  'thông số',
  'tính năng',
  'pin',
  'kết nối',
  'điện thoại',
  'điện thoai',
  'hỗ trợ',
  'theo dõi',
  'giấc ngủ',
  'sức khỏe',
  'so sánh',
  'loại nào',
  'mẫu nào',
  'dòng nào',
  'công ty',
  'thương hiệu',
  'có gì',
  'gồm gì',
  'bao gồm',
]
const FOLLOW_UP_TERMS = ['which one', 'this one', 'that one', 'lighter', 'better', 'best', 'nó', 'cái nào', 'mẫu nào', 'loại nào']

function getSuggestions(language: 'vi' | 'en') {
  return language === 'vi' ? [...VIETNAMESE_SUGGESTIONS] : [...ENGLISH_SUGGESTIONS]
}

function getCatalogTerms() {
  const terms = new Set<string>()

  for (const product of products) {
    terms.add(product.slug.toLowerCase())
    terms.add(product.name.toLowerCase())
    terms.add(product.badge?.toLowerCase() ?? '')

    for (const color of product.colors) {
      terms.add(color.name.toLowerCase())

      if (color.shortName) {
        terms.add(color.shortName.toLowerCase())
      }
    }

    for (const feature of product.features) {
      terms.add(feature.title.toLowerCase())
    }

    for (const [label, value] of Object.entries(product.specs)) {
      terms.add(label.toLowerCase())
      terms.add(value.toLowerCase())
    }
  }

  return [...terms].filter(Boolean)
}

const CATALOG_TERMS = getCatalogTerms()

export function normalizeMessage(message: string) {
  return message.toLowerCase().trim().replace(/\s+/g, ' ')
}

export function detectChatLanguage(message: string) {
  const normalized = normalizeMessage(message)

  if (/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(normalized)) {
    return 'vi' as const
  }

  if (VIETNAMESE_HINTS.some((keyword) => normalized.includes(keyword))) {
    return 'vi' as const
  }

  return 'en' as const
}

function isGreetingMessage(message: string) {
  const normalized = normalizeMessage(message)
  return GREETING_KEYWORDS.some((keyword) => normalized === keyword || normalized.startsWith(`${keyword} `))
}

function isScopedText(message: string) {
  const normalized = normalizeMessage(message)

  return (
    AURORA_TERMS.some((term) => normalized.includes(term)) ||
    SHOPPING_TERMS.some((term) => normalized.includes(term)) ||
    CATALOG_TERMS.some((term) => normalized.includes(term))
  )
}

export function isAuroraScopedMessage(message: string, history: ChatTurn[] = []) {
  if (isGreetingMessage(message)) {
    return true
  }

  if (isScopedText(message)) {
    return true
  }

  const normalized = normalizeMessage(message)
  const recentUserHistory = history
    .filter((turn) => turn.role === 'user')
    .slice(-3)
    .map((turn) => turn.content)

  return FOLLOW_UP_TERMS.some((term) => normalized.includes(term)) && recentUserHistory.some((turn) => isScopedText(turn))
}

export function buildOutOfScopeResponse(message: string): ChatResponse {
  const language = detectChatLanguage(message)

  if (language === 'vi') {
    return {
      message: `Mình chỉ hỗ trợ về ${siteConfig.brand}: dòng sản phẩm, màu sắc, kích cỡ, giá, thông số, so sánh và liên kết nội bộ tới trang sản phẩm hoặc giỏ hàng.`,
      suggestions: getSuggestions(language),
      links: [{ label: 'Xem sản phẩm', href: '/products' }],
    }
  }

  return {
    message: `I can only help with ${siteConfig.brand} products, specs, comparisons, pricing, sizing, colors, and internal product or cart links.`,
    suggestions: getSuggestions(language),
    links: [{ label: 'View products', href: '/products' }],
  }
}

export function buildUnavailableResponse(message: string): ChatResponse {
  const language = detectChatLanguage(message)

  if (language === 'vi') {
    return {
      message: `${siteConfig.name} AI Assistant tạm thời chưa phản hồi được. Vui lòng thử lại sau ít phút.`,
      suggestions: ['So sánh Aura Air và Aura Pro', 'Có những màu nào?'],
      links: [],
    }
  }

  return {
    message: `${siteConfig.name} AI Assistant is temporarily unavailable right now. Please try again shortly.`,
    suggestions: ['Compare Aura Air and Aura Pro', 'Show available colors'],
    links: [],
  }
}
