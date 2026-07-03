export interface TrackingEvent {
  type: 'click' | 'scroll'
  target: string
  timestamp: number
  metadata?: Record<string, unknown>
}

export type TrackingEventType = TrackingEvent['type']
