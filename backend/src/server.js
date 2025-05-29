import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routers/auth.route.js'
import userRoutes from './routers/user.route.js'
import chatRoutes from './routers/chat.route.js'
import { connectDb as connectDB } from './lib/db.js'
import cookieParser from 'cookie-parser'

dotenv.config()
const app = express()
const PORT = process.env.PORT
app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
  res.send('helloword')
})
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`)
  connectDB()
})