import { z } from 'zod'

export const trackingEventSchema = z.object({
  type: z.enum(['click', 'scroll']),
  target: z.string().trim().min(1),
  timestamp: z.number().finite(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export type TrackingEventInput = z.input<typeof trackingEventSchema>
export type TrackingEventPayload = z.infer<typeof trackingEventSchema>
