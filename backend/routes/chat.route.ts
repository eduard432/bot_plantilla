import { Router } from 'express'
import {
	handleAddChat,
	handleSearchChat,
	handleGetChatInfoById,
	handleChat,
} from '../controllers/chat'
import { validate } from '../middleware/validate'
import {
	addChatSchema,
	chatSchema,
	getChatInfoByIdSchema,
	searchChatSchema,
} from '../validators/chat.validator'

const router = Router()

router.post('/add', validate(addChatSchema.body), handleAddChat)
router.get('/search', validate(searchChatSchema.body), handleSearchChat)
router.get(
	'/info/:chatId',
	validate(getChatInfoByIdSchema.params, 'params'),
	handleGetChatInfoById
)
router.post(
	'/:chatId',
	validate(chatSchema.body),
	validate(chatSchema.params, 'params'),
	handleChat
)

export default router
