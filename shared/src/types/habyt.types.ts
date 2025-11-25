import type { z } from 'zod'
import type { habytCreateSchema, habytUpdateSchema, habytSchema } from '../schemas/habyt.schema.js'

export type HabytCreateBody = z.infer<typeof habytCreateSchema>
export type HabytUpdateBody = z.infer<typeof habytUpdateSchema>
export type Habyt = z.infer<typeof habytSchema>

export type HabytCreateRequest = HabytCreateBody & { token: string }

// Services
export interface HabytCreateData {
  title: string,
  description: string | null,
  userId: string 
}

export interface HabytUpdateData {
  id: string
  title: string
  description: string | null
  userId: string
}

export interface HabytUpdateResult { 
  habyt: Habyt
}