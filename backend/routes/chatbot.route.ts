import { Router } from 'express'
import {
	handleAddConnection,
	handleAddPlugin,
	handleCreateChatBot,
	handleDeleteChatbot,
	handleDeleteConnection,
	handleDeletePlugin,
	handleGetChatbot,
	handleGetChatbots,
	handleGetPlugins,
	handleGetStats,
	handleUpdateChatbots,
} from '../controllers/chatbot'
import { validate } from '../middleware/validate'
import {
	addConnectionSchema,
	addPluginSchema,
	createChatbotSchema,
	deleteChatbotSchema,
	deleteConnectionSchema,
	getChatbotSchema,
	getStatsSchema,
	updateChatbotsSchema,
} from '../validators/chatbot.validator'

const router = Router()

router.get('/stats/:id', validate(getStatsSchema.params, 'params'), handleGetStats)
router.post(
	'/connection',
	validate(addConnectionSchema.body, 'body'),
	handleAddConnection
)
router.post(
	'/connection/delete',
	validate(deleteConnectionSchema.body),
	handleDeleteConnection
)

router.get('/plugins', handleGetPlugins)
router.post('/plugins', validate(addPluginSchema.body), handleAddPlugin)
router.delete('/plugins', validate(deleteConnectionSchema.body), handleDeletePlugin)

router.post('/', validate(createChatbotSchema.body), handleCreateChatBot)
router.get('/all', handleGetChatbots)
router.get('/:id', validate(getChatbotSchema.params, 'params'), handleGetChatbot)
router.put(
	'/:id',
	validate(updateChatbotsSchema.params, 'params'),
	validate(updateChatbotsSchema.body),
	handleUpdateChatbots
)
router.delete('/:id', validate(deleteChatbotSchema.params), handleDeleteChatbot)

export default router