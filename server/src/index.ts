import express from 'express'

import userRouter from './routes/users.routes.js'
import loginRouter from './routes/login.routes.js'
import habytRouter from './routes/habyts.routes.js'
import { connectToDatabase } from './db/index.js'
import { PORT } from './config/index.js'

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

export default app