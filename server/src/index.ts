import express from 'express'

import { connectToDatabase } from './utils/db.js'
import { PORT } from './utils/config.js'

const app = express()

app.get('/', (_req, res) => {
  res.send('Hello, World!')
})

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`)
    })
  })
  .catch((error) => {
    console.error("Error starting server:", error)
  })