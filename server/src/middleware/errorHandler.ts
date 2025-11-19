import type { Request, Response, NextFunction } from "express"
import { AppError } from "../utils/errors.js"

const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof AppError) {
    return res.status(error.status).json({
      error: error.message,
      type: error.constructor.name,
      details: error.details
    })
  }
  
  return res.status(500).json({
    error: error instanceof Error ? error.message: String(error)
  })
}

export default errorHandler