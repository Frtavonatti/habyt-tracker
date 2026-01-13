import { z } from "zod"

// Body Schemas
export const entryCreateSchema = z.object({
  completed: z.boolean().optional().default(false),
  timeSpentMinutes: z.number().int().nonnegative('Time spent must be non-negative').nullable().optional().default(null),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional().nullable().default(null),
})

export const entryUpdateSchema = z.object({
  completed: z.boolean().optional().default(false),
  timeSpentMinutes: z.number().int().nonnegative('Time spent must be non-negative').nullable().optional()
}).refine(
  (data) => data.completed !== undefined || data.timeSpentMinutes !== undefined,
  { message: 'At least one field must be provided for update' }
)

// Params Schemas
export const habytIdParamSchema = z.object({
  habytId: z.uuid('Invalid habyt ID format')
})

export const entryIdParamSchema = z.object({
  id: z.uuid('Invalid entry ID format')
})

// Full Schemas
export const entrySchema = z.object({
  id: z.uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  completed: z.boolean(),
  timeSpentMinutes: z.number().int().nonnegative().nullable(),
  habytId: z.uuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
})
