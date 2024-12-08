import { RequestHandler, Router } from 'express'
import { ChatBot } from '../types/ChatBot'
import { getDatabase } from '../utils/mongodb'
import { ObjectId } from 'mongodb'
import { Chat } from '../types/Chat'
import { testMessages } from '../mock/mockData'

const ChatBotRouter = Router()

const handleCreateChatBot: RequestHandler<{}, {}, ChatBot> = async (req, res) => {
	try {
		const { model, name, initialPrompt } = req.body

		const chatBotId = new ObjectId()
		const chatId = new ObjectId()

		const db = getDatabase()
		const chatBotCollection = db.collection<ChatBot>('chatbot')
		const chatCollection = db.collection<Chat>('chat')

		const chatBot = {_id: chatBotId, model, name, initialPrompt, defaultChatId: chatId }
		const chatBotResult = await chatBotCollection.insertOne(chatBot)
		await chatCollection.insertOne({_id:chatId, chatBotId: chatBotId, messages: testMessages})
 
		if(chatBotResult) {
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
	const { id } = req.params
	const objectId = new ObjectId(id)
	const { name, model, initialPrompt } = req.body

	const db = getDatabase()
	const collection = db.collection<ChatBot>('chatbot')
	const result = await collection.updateOne({ _id: objectId }, { $set: { name, model, initialPrompt } })

	if (result.modifiedCount > 0) {
		res.json({
			msg: 'Chatbot updated!!!',
		})
	} else {
		res.json({
			msg: 'Error updating chatbot!!',
		})
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

ChatBotRouter.post('/', handleCreateChatBot)
ChatBotRouter.get('/all', handleGetChatbots)
ChatBotRouter.get('/:id', handleGetChatbot)
ChatBotRouter.put('/:id', handleUpdateChatbots)
ChatBotRouter.delete('/:id', handleDeleteChatbot)

export default ChatBotRouter
