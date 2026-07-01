import type { ChatIntent, ChatLink, ChatResponse } from '@/types/chat'

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

const PRODUCT_KEYWORDS = [
  'aura',
  'aurora',
  'ring',
  'product',
  'model',
  'size',
  'color',
  'colour',
  'price',
  'battery',
  'spec',
  'feature',
  'sleep',
  'stress',
  'recovery',
  'heart',
  'spo2',
  'cart',
  'compare',
  'difference',
  'recommend',
  'buy',
  'shop',
  'training',
  'fitness',
  'cheap',
  'lighter',
  'light',
  'pro',
  'air',
  'elite',
  'obsidian',
  'nhẫn',
  'nhan',
  'sản phẩm',
  'san pham',
  'mẫu',
  'mau',
  'màu',
  'gia',
  'giá',
  'pin',
  'thông số',
  'thong so',
  'tính năng',
  'tinh nang',
  'kết nối',
  'ket noi',
  'điện thoại',
  'dien thoai',
  'phone',
  'mobile',
  'connect',
  'connectivity',
  'bluetooth',
  'sleep tracking',
  'theo dõi giấc ngủ',
  'theo doi giac ngu',
  'giấc ngủ',
  'giac ngu',
  'giấc',
  'giac',
  'ngủ',
  'ngu',
  'hỗ trợ',
  'ho tro',
  'specs',
  'compatibility',
  'sensor',
  'heart rate',
  'stress tracking',
  'recovery tracking',
  'water resistance',
  'chống nước',
  'chong nuoc',
  'battery life',
  'ios',
  'android',
  'app',
  'ứng dụng',
  'ung dung',
  'tracking',
  'theo dõi',
  'theo doi',
  'phù hợp',
  'phu hop',
  'hợp',
  'hop',
  'loại nào',
  'loai nao',
  'mẫu nào',
  'mau nao',
  'dòng nào',
  'dong nao',
  'loại',
  'loai',
  'mẫu',
  'mau',
  'dòng',
  'dong',
  'có loại nào',
  'co loai nao',
  'có mẫu nào',
  'co mau nao',
  'có dòng nào',
  'co dong nao',
  'which one',
  'which ring',
  'what models',
  'what model',
  'available models',
  'available model',
  'available rings',
  'which model',
  'which models',
  'supports',
  'support',
  'works with',
  'best for',
  'best ring',
  'fits',
  'fit',
  'sleep',
  'track',
  'tracking',
  'recovery',
  'stress',
  'heart',
  'spo2',
  'water',
  'weight',
  'material',
  'compatibility',
  'connectivity',
  'battery',
  'sensor',
  'spec',
  'specs',
  'feature',
  'features',
  'price',
  'colors',
  'sizes',
  'size',
  'color',
  'model',
  'models',
  'ring',
  'product',
  'products',
  'aurora',
  'aura',
  'company',
  'brand',
  'smart ring',
  'health ring',
  'recovery ring',
  'sleep ring',
  'fitness ring',
  'training ring',
  'jewelry-first',
  'jewellery-first',
  'premium ring',
  'premium',
  'health',
  'wellness',
  'recovery-first',
  'rest',
  'focus',
  'training',
  'fitness',
  'cheap',
  'lighter',
  'light',
  'compare',
  'difference',
  'recommend',
  'buy',
  'shop',
  'cart',
  'obsidian',
  'elite',
  'air',
  'pro',
  'aurora ring',
  'aura ring',
  'nhẫn thông minh',
  'nhan thong minh',
  'nhẫn sức khỏe',
  'nhan suc khoe',
  'thương hiệu',
  'thuong hieu',
  'công ty',
  'cong ty',
  'smart ring',
  'health ring',
  'product links',
  'liên kết sản phẩm',
  'lien ket san pham',
  'giỏ hàng',
  'gio hang',
  'mua',
  'buy',
  'shop',
  'so sánh',
  'so sanh',
  'kích cỡ',
  'kich co',
  'kích thước',
  'kich thuoc',
  'màu',
  'mau',
  'giá',
  'gia',
  'pin',
  'giúp',
  'tư vấn',
  'tu van',
  'gợi ý',
  'goi y',
  'nên mua',
  'nen mua',
  'tập luyện',
  'tap luyen',
  'rẻ',
  're',
  'nhẹ',
  'nhe',
  'sản phẩm',
  'san pham',
  'service',
  'dịch vụ',
  'dich vu',
  'about',
  'what is aurora',
  'aurora là gì',
  'la gi',
  'là gì',
  'có gì',
  'co gi',
  'gồm gì',
  'gom gi',
  'bao gồm',
  'bao gom',
  'lineup',
  'catalog',
  'catalogue',
  'available',
  'availability',
  'in stock',
  'stock',
  'restock',
  'finish',
  'finishes',
  'material',
  'materials',
  'titanium',
  'graphite',
  'black',
  'silver',
  'gold',
  'rose',
  'sage',
  'ngủ',
  'giấc ngủ',
  'gic ngu',
  'sức khỏe',
  'suc khoe',
  'giỏ hàng',
  'gio hang',
  'so sánh',
  'so sanh',
  'kích cỡ',
  'kich co',
  'kích thước',
  'kich thuoc',
  'gợi ý',
  'goi y',
  'nên mua',
  'nen mua',
  'tập luyện',
  'tap luyen',
  'rẻ',
  're',
  'nhẹ',
  'nhe',
] as const

const VIETNAMESE_HINTS = [
  'xin chào',
  'chào',
  'giúp',
  'tư vấn',
  'nhẫn',
  'màu',
  'giá',
  'pin',
  'giấc ngủ',
  'sức khỏe',
  'giỏ hàng',
  'so sánh',
  'kích cỡ',
  'kích thước',
] as const

const GREETING_KEYWORDS = [
  'hi',
  'hello',
  'hey',
  'good morning',
  'good afternoon',
  'good evening',
  'xin chào',
  'chào',
  'helo',
] as const

function getSuggestions(language: 'vi' | 'en') {
  return language === 'vi' ? [...VIETNAMESE_SUGGESTIONS] : [...ENGLISH_SUGGESTIONS]
}

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

export function classifyChatIntent(message: string): ChatIntent {
  const normalized = normalizeMessage(message)
  const keywordMatched = PRODUCT_KEYWORDS.find((keyword) => normalized.includes(keyword))

  console.info(`[chat:classify] normalized=${normalized} keyword=${keywordMatched ?? 'none'}`)

  if (GREETING_KEYWORDS.some((keyword) => normalized === keyword || normalized.startsWith(`${keyword} `))) {
    return 'greeting'
  }

  if (
    normalized === 'compare aura air and aura pro' ||
    normalized === 'compare aura air vs aura pro' ||
    normalized === 'so sánh aura air và aura pro'
  ) {
    return 'compare-products'
  }

  if (
    normalized === 'show available colors' ||
    normalized === 'what colors are available?' ||
    normalized === 'available colors' ||
    normalized === 'có những màu nào?'
  ) {
    return 'show-colors'
  }

  if (
    normalized === 'which sizes are in stock?' ||
    normalized === 'what sizes are in stock?' ||
    normalized === 'available sizes' ||
    normalized === 'size nào còn hàng?'
  ) {
    return 'show-sizes'
  }

  if (
    normalized === 'which aura ring fits sleep tracking?' ||
    normalized === 'best aura ring for sleep tracking' ||
    normalized === 'nhẫn nào hợp để theo dõi giấc ngủ?' ||
    normalized === 'nhẫn nào hợp để theo dõi giấc ngủ' ||
    normalized === 'nhan nao hop de theo doi giac ngu' ||
    normalized === 'ring nào hợp để theo dõi giấc ngủ' ||
    normalized === 'ring nao hop de theo doi giac ngu'
  ) {
    return 'sleep-recommendation'
  }

  if (
    normalized.includes('kết nối điện thoại') ||
    normalized.includes('ket noi dien thoai') ||
    normalized.includes('connectivity') ||
    normalized.includes('connect phone') ||
    normalized.includes('works with phone') ||
    normalized.includes('bluetooth') ||
    normalized.includes('ios') ||
    normalized.includes('android') ||
    normalized.includes('compatibility')
  ) {
    return 'open-ended'
  }

  if (PRODUCT_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return 'open-ended'
  }

  return 'out-of-scope'
}

function buildGreetingLinks(language: 'vi' | 'en'): ChatLink[] {
  return language === 'vi'
    ? [
        { label: 'Xem sản phẩm', href: '/products' },
        { label: 'Mở giỏ hàng', href: '/cart' },
      ]
    : [
        { label: 'View products', href: '/products' },
        { label: 'Open cart', href: '/cart' },
      ]
}

export function buildGreetingResponse(message: string): ChatResponse {
  const language = detectChatLanguage(message)

  if (language === 'vi') {
    return {
      message:
        'Xin chào, mình là Aurora Assistant. Mình có thể tư vấn các dòng nhẫn sức khỏe Aura, màu sắc, kích cỡ, giá, thông số và dẫn bạn tới trang sản phẩm hoặc giỏ hàng.',
      suggestions: getSuggestions(language),
      links: buildGreetingLinks(language),
    }
  }

  return {
    message:
      'Hello, I am Aurora Assistant. I can help with Aura health ring models, colors, sizes, pricing, specs, and direct links to products or cart.',
    suggestions: getSuggestions(language),
    links: buildGreetingLinks(language),
  }
}

export function buildOutOfScopeResponse(message: string): ChatResponse {
  const language = detectChatLanguage(message)

  if (language === 'vi') {
    return {
      message:
        'Mình chỉ hỗ trợ về nhẫn sức khỏe Aurora, gồm so sánh sản phẩm, màu sắc, kích cỡ, giá, thông số và liên kết nội bộ tới sản phẩm hoặc giỏ hàng.',
      suggestions: getSuggestions(language),
      links: [{ label: 'Xem sản phẩm', href: '/products' }],
    }
  }

  return {
    message:
      'I can only help with Aurora health rings, including product differences, colors, sizes, pricing, specs, and internal product or cart links.',
    suggestions: getSuggestions(language),
    links: [{ label: 'View products', href: '/products' }],
  }
}

export function buildUnavailableResponse(message: string): ChatResponse {
  const language = detectChatLanguage(message)

  if (language === 'vi') {
    return {
      message: 'Aurora Assistant tạm thời chưa phản hồi được. Vui lòng thử lại sau ít phút.',
      suggestions: ['So sánh Aura Air và Aura Pro', 'Có những màu nào?'],
      links: [],
    }
  }

  return {
    message: 'Aurora Assistant is temporarily unavailable right now. Please try again shortly.',
    suggestions: ['Compare Aura Air and Aura Pro', 'Show available colors'],
    links: [],
  }
}
