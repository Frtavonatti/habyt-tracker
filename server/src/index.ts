import express from 'express'

import userRouter from './controllers/users.js'
import loginRouter from './controllers/login.js'
import habytRouter from './controllers/habyts.js'
import { connectToDatabase } from './utils/db.js'
import { PORT } from './utils/config.js'

const app = express()
app.use(express.json())

app.use('/api/users', userRouter)
app.use('/api/habyts', habytRouter)
app.use('/api/login', loginRouter)

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`)
    })
  })
  .catch((error) => {
    console.error("Error starting server:", error)
  })