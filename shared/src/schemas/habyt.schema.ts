import { z } from "zod"

export const habytCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  description: z.string().trim().nullable().optional()
}).transform((data) => ({
  title: data.title,
  description: data.description ?? null
}))

export const habytUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  description: z.string().trim().nullable().optional()
}).transform((data) => ({
  title: data.title,
  description: data.description ?? null
}))

export const habytSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().nullable(),
  userId: z.uuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
})