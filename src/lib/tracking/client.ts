export async function trackEvent(
  type: 'click' | 'scroll',
  target: string,
  metadata?: Record<string, unknown>
) {
  const response = await fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, target, timestamp: Date.now(), metadata }),
  })

  return response.ok
}

export function trackClick(target: string, metadata?: Record<string, unknown>) {
  return trackEvent('click', target, metadata)
}

export function trackScroll(target: string, metadata?: Record<string, unknown>) {
  return trackEvent('scroll', target, metadata)
}
