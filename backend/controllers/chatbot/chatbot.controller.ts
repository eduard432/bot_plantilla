import { ObjectId } from 'mongodb'
import { getDatabase } from '../../utils/mongodb'
import { RequestHandler } from 'express'
import { ChatBot } from '../../types/ChatBot'
import { Chat } from '../../types/Chat'
import pickBy from 'lodash.pickby'

export const handleCreateChatBot: RequestHandler<
	{},
	{},
	{ name: string; model: string; initialPrompt: string }
> = async (req, res) => {
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
			chats: [],
			tools: [],
			usedTokens: 0,
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

export const handleGetChatbot: RequestHandler<{ id: string }> = async (req, res) => {
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

export const handleGetChatbots: RequestHandler = async (req, res) => {
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

export const handleDeleteChatbot: RequestHandler<{ id: string }> = async (req, res) => {
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

export const handleUpdateChatbots: RequestHandler<
	{ id: string },
	{},
	{ name: string; model: string; initialPrompt: string }
> = async (req, res) => {
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
