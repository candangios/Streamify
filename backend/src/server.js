import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routers/auth.route.js'
import userRoutes from './routers/user.route.js'
import chatRoutes from './routers/chat.route.js'
import { connectDb as connectDB } from './lib/db.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

dotenv.config()
var corsOptions = {
  origin: 'http://localhost:5173', // or an array of origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}
const app = express()
const PORT = process.env.PORT
app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))

app.get('/', (req, res) => {
  res.send('helloword')
})
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/chat', chatRoutes)

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`)
  connectDB()
})