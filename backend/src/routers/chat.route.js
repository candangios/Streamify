import express from 'express'
import { protectedRoute } from '../middleware/auth.middleware.js'
import { getStreamToken } from '../controllers/chat.controller.js'

const router = express.Router()
// apply auth middleware to all routes
router.use(protectedRoute)
router.get('/token', getStreamToken)
export default router