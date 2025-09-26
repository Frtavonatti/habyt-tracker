import express from 'express'

import { connectToDatabase } from './utils/db'
import { PORT } from './utils/config'

const app = express()

app.get('/', (_req, res) => {
  res.send('Hello, World!')
})

app.listen(PORT, async () => {
  await connectToDatabase()
  console.log(`Server is running at http://localhost:${PORT}`)
})