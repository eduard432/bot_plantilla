import { Router } from 'express'
import chatRoutes from './chat.route'
import chatBotRouter from './chatbot.route'

const router = Router()

router.use('/chat', chatRoutes)
router.use('/chatbot', chatBotRouter)

export default router