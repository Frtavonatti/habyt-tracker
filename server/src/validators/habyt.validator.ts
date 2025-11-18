import { ValidationError } from '../utils/errors.js'

export function validateHabytTitle(title: unknown) {
  if (!title || typeof title !== 'string' || title.trim() === '')
    throw new ValidationError('Title is required')
}

export function validateHabytDescription(description: unknown) {
  if (description !== undefined && description !== null && typeof description !== 'string')
    throw new ValidationError('Description must be a string')
}