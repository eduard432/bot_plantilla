import { RequestHandler, Router } from 'express'
import { ChatBot, Connection, ConnectionType } from '../types/ChatBot'
import { getDatabase } from '../utils/mongodb'
import { ObjectId, UpdateFilter } from 'mongodb'
import { Chat } from '../types/Chat'
import pickBy from 'lodash.pickby'

const ChatBotRouter = Router()

const handleCreateChatBot: RequestHandler<{}, {}, ChatBot> = async (req, res) => {
	try {
		const { model, name, initialPrompt } = req.body

		const chatBotId = new ObjectId()
		const chatId = new ObjectId()

		const db = getDatabase()
		const chatBotCollection = db.collection<ChatBot>('chatbot')
		const chatCollection = db.collection<Chat>('chat')

		const chatBot = {
			_id: chatBotId,
			model,
			name,
			initialPrompt,
			defaultChatId: chatId,
			connections: {},
		}
		const chatBotResult = await chatBotCollection.insertOne(chatBot)

		await chatCollection.insertOne({ _id: chatId, chatBotId: chatBotId, messages: [] })

		if (chatBotResult) {
			res
				.json({
					msg: 'Chatbot created',
					chatBot: chatBot,
				})
				.status(201)
		} else {
			throw Error('Error trying to create chatbot')
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

const handleGetChatbot: RequestHandler<{ id: string }> = async (req, res) => {
	try {
		const { id } = req.params
		const objectId = new ObjectId(id)

		const db = getDatabase()
		const collection = db.collection<ChatBot>('chatbot')
		const result = await collection.findOne({ _id: objectId })
		if (result) {
			res.json(result)
		} else {
			res
				.json({
					msg: 'File not found',
				})
				.status(404)
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

const handleGetChatbots: RequestHandler = async (req, res) => {
	try {
		const db = getDatabase()
		const collection = db.collection<ChatBot>('chatbot')
		const result = await collection.find({}).toArray()
		if (result) {
			res.json(result)
		} else {
			res
				.json({
					msg: 'Files not found',
				})
				.status(404)
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

const handleUpdateChatbots: RequestHandler<{ id: string }, {}, ChatBot> = async (
	req,
	res
) => {
	try {
		const { id } = req.params
		const objectId = new ObjectId(id)
		const { name, model, initialPrompt } = req.body
		const updatedValues = pickBy({ name, model, initialPrompt })

		const db = getDatabase()
		const collection = db.collection<ChatBot>('chatbot')
		const result = await collection.updateOne({ _id: objectId }, { $set: updatedValues })

		if (result.modifiedCount > 0) {
			res.json({
				msg: 'Chatbot updated!!!',
			})
		} else {
			throw Error('Error updating chatbot!!')
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

const handleDeleteChatbot: RequestHandler<{ id: string }> = async (req, res) => {
	const { id } = req.params
	const objectId = new ObjectId(id)

	const db = getDatabase()
	const collection = db.collection<ChatBot>('chatbot')
	const result = await collection.deleteOne({ _id: objectId })
	if (result) {
		res.json({
			msg: 'Chatbot removed!!!',
		})
	} else {
		res.json({
			msg: 'Error trying to remove chatbot!!',
		})
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

ChatBotRouter.post('/', handleCreateChatBot)
ChatBotRouter.get('/all', handleGetChatbots)
ChatBotRouter.get('/:id', handleGetChatbot)
ChatBotRouter.put('/:id', handleUpdateChatbots)
ChatBotRouter.delete('/:id', handleDeleteChatbot)

ChatBotRouter.post('/connection', handleAddConnection)
ChatBotRouter.post('/connection/delete', handleDeleteConnection)

export default ChatBotRouter
