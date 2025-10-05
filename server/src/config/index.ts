import dotenv from 'dotenv'

dotenv.config()

function requireEnv(name: string): string {
  const value = process.env[name] 
  if (!value) {
    throw new Error(`[config] Missing required environment variable: ${name}`)
  }
  return value
}

export const PORT = Number(process.env.PORT) || 3000
export const JWT_SECRET = requireEnv('JWT_SECRET')

export const DATABASE_URL = requireEnv('DATABASE_URL')
export const TEST_DATABASE_URL = requireEnv('TEST_DATABASE_URL')
export const DEV_DATABASE_URL = requireEnv('DEV_DATABASE_URL')