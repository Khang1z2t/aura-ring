import { trackingEventSchema } from './schema'

export async function trackEvent(event: unknown) {
  const parsed = trackingEventSchema.safeParse(event)

  if (!parsed.success) {
    return { ok: false as const, status: 400 as const }
  }

  const webhookUrl = process.env.WEBHOOK_SITE_URL?.trim()

  if (webhookUrl) {
    void fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
    }).catch(() => undefined)
  }

  return { ok: true as const, status: 200 as const, event: parsed.data }
}
