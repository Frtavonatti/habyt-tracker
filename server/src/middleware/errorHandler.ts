import type { Request, Response, NextFunction } from "express"
import { ZodError } from "zod"
import { AppError } from "../utils/errors.js"

const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      type: 'ZodError',
      details: error.issues.map(e => ({
        path: e.path.join('.'),
        message: e.message
      }))
    })
  }

  if (error instanceof AppError) {
    return res.status(error.status).json({
      error: error.message,
      type: error.constructor.name,
      details: error.details
    })
  }

  console.error('Unexpected error:', {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    url: req.url,
    method: req.method
  })

  return res.status(500).json({
    error: 'Internal server error'
  })
}

export default errorHandler
