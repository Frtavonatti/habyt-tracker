import express from 'express'
import cors from 'cors'

import userRouter from './routes/users.routes.js'
import loginRouter from './routes/login.routes.js'
import habytRouter from './routes/habyts.routes.js'
import entriesRouter, { habytEntriesRouter } from './routes/entries.routes.js'
import errorHandler from './middleware/errorHandler.js'
import { connectToDatabase } from './db/index.js'
import { PORT } from './config/index.js'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/users', userRouter)
app.use('/api/habyts', habytRouter)
app.use('/api/login', loginRouter)
app.use('/api/entries', entriesRouter)
app.use('/api/habyts', habytEntriesRouter)

app.use(errorHandler)

connectToDatabase()
  .then(() => {
    if (process.env.NODE_ENV !== 'test') {
      app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`)
      })
    }
  })
  .catch((error) => {
    console.error("Error starting server:", error)
  })

export default app