import dotenv from 'dotenv'

dotenv.config()

export const PORT = process.env.PORT ?? 3000

export const DATABASE_URL = process.env.DATABASE_URL
export const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL
export const DEV_DATABASE_URL = process.env.DEV_DATABASE_URL