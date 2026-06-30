import { z } from 'zod'

export const subscribeSchema = z.object({
  email: z.email(),
  name: z.string().trim().min(1).optional(),
})

export const chatMessageSchema = z.object({
  message: z.string().trim().min(1),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().trim().min(1),
      })
    )
    .default([]),
})
