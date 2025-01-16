import { RequestHandler, Router } from 'express'
import { ChatBot, ConnectionType } from '../types/ChatBot'
import { getDatabase } from '../utils/mongodb'
import { ObjectId, UpdateFilter } from 'mongodb'
import { Chat } from '../types/Chat'
import pickBy from 'lodash.pickby'
import { aiPlugins } from '../ai/plugins'

const ChatBotRouter = Router()















const handleDeletePlugin: RequestHandler<{}, {}, { botId: string; plugin: string }> = async (req, res) => {
	try {
		const { botId, plugin } = req.body

		const db = getDatabase()
		const collection = db.collection<ChatBot>('chatbot')
		const objectId = new ObjectId(botId)

		const query = {
			_id: objectId,
			tools: { $in: [plugin] },
		}

		const update = {
			$pull: {
				tools: plugin,
			},
		}

		const result = await collection.updateOne(query, update)

		if (result.modifiedCount > 0) {
			res.json({
				msg: 'Chatbot updated!!!',
			})
		} else {
			res.json({
				msg: 'Chatbot not updated'
			}).status(400)
		}
	} catch (error) {
		console.log(error)
		res
			.json({
				msg: 'Error',
			})
			.status(501)
	}
}

const handleAddConnection: RequestHandler<
	{},
	{},
	{ id: string; type: ConnectionType }
> = async (req, res) => {
	try {
		const { id, type } = req.body
		const objectId = new ObjectId(id)

		const db = getDatabase()
		const collection = db.collection<ChatBot>('chatbot')
		const path = `connections.${type}`

		const query = {
			_id: objectId,
			[path]: { $exists: false, $ne: true },
		}

		const update = {
			$set: {
				[path]: {
					type,
					chatsId: [],
				},
			},
		}

		const result = await collection.updateOne(query, update)

		if (result.modifiedCount > 0) {
			res.json({
				msg: 'Chatbot updated!!!',
			})
		} else {
			res.json({
				msg: 'Chatbot not updated'
			})
		}
	} catch (error) {
		console.log(error)
		res
			.json({
				msg: 'Error',
			})
			.status(500)
	}
}

const handleDeleteConnection: RequestHandler<
	{},
	{},
	{ id: string; type: ConnectionType }
> = async (req, res) => {
	try {
		const { id, type } = req.body
		const objectId = new ObjectId(id)

		const db = getDatabase()
		const collection = db.collection<ChatBot>('chatbot')
		const path = `connections.${type}`

		const query = {
			_id: objectId,
			[path]: { $exists: true, $ne: true },
		}

		const update: UpdateFilter<ChatBot> = {
			$unset: {
				[path]: ""
			},
		}

		const result = await collection.updateOne(query, update)

		if (result.modifiedCount > 0) {
			res.json({
				msg: 'Chatbot updated!!!',
			})
		} else {
			res.json({
				msg: 'Chatbot not updated'
			}).status(400)
		}
	} catch (error) {
		console.log(error)
		res
			.json({
				msg: 'Error',
			})
			.status(500)
	}
}

const handleGetStats: RequestHandler<{id: string}> = async (req, res) => {
	try {
		const { id } = req.params

		const db = getDatabase()
		const collection = db.collection<Chat>('chat')
		const objectId = new ObjectId(id)

		const chatCount = await collection.countDocuments({chatBotId: objectId})

		// Aggregate operation to count the number of messages
		const result = await collection.aggregate([
			{ $match: { chatBotId: objectId } },
			{ $unwind: '$messages' },
			{ $count: 'messages' },
		]).next()

		const messageCount = result ? result.messages : 0;

		res.json({
			chatCount,
			messageCount,
		})


	} catch (error) {
		console.log(error)
		res
			.json({
				msg: 'Error',
			})
			.status(500)
	}
}

ChatBotRouter.get('/stats/:id', handleGetStats)

ChatBotRouter.post('/connection', handleAddConnection)
ChatBotRouter.post('/connection/delete', handleDeleteConnection)

ChatBotRouter.get('/plugins', handleGetPlugins)
ChatBotRouter.post('/plugins', handleAddPlugin)
ChatBotRouter.delete('/plugins', handleDeletePlugin)

ChatBotRouter.post('/', handleCreateChatBot)
ChatBotRouter.get('/all', handleGetChatbots)
ChatBotRouter.get('/:id', handleGetChatbot)
ChatBotRouter.put('/:id', handleUpdateChatbots)
ChatBotRouter.delete('/:id', handleDeleteChatbot)





export default ChatBotRouter
