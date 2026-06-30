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

export const checkoutSchema = z.object({
  email: z.email(),
  fullName: z.string().trim().min(1),
  address: z.string().trim().min(1),
  city: z.string().trim().min(1),
  postalCode: z.string().trim().min(1),
  country: z.string().trim().min(1),
  cardNumber: z.string().trim().min(12),
  expiryDate: z.string().trim().min(4),
  cvc: z.string().trim().min(3),
})

export type CheckoutValues = z.infer<typeof checkoutSchema>
