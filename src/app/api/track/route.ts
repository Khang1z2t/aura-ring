import { trackEvent } from '@/lib/tracking/track-event'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const result = await trackEvent(body)

  return Response.json(result.ok ? { ok: true } : { ok: false }, { status: result.status })
}
