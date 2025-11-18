import { ValidationError } from '../utils/errors.js'

export const validateHabytId = (habytId: string) => {
  if (!habytId || typeof habytId != 'string' || habytId.trim() === '' )
    throw new ValidationError('habytId param is required') 
}

export const validateEntryId = (id: unknown) => {
  if (!id || typeof id !== 'string' || id.trim() === '')
    throw new ValidationError('Entry id param must be defined')
}

export const validateTimeSpent = (timeSpentMinutes: unknown) => {
  if (timeSpentMinutes !== null && (typeof timeSpentMinutes !== 'number' || timeSpentMinutes < 0))
    throw new ValidationError('timeSpentMinutes must be a non negative number or null')
}