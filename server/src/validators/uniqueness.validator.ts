import User from "../models/user.js"
import { ValidationError } from "../utils/errors.js"

export const validateUniqueUserFields = async (
  params: Partial<{username: string, email: string}>
): Promise<true | { error: string }> => {
  for (const [key, value] of Object.entries(params) ) {
    if (!value) continue
    const isMatching = await User.findOne({ where: { [key]: value } })
    if (isMatching) throw new ValidationError(`${key} must be unique`)
  }
  return true
}
