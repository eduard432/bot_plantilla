import { RequestHandler, Router } from 'express'
import { Chat, Message } from '../types/Chat'
import { getDatabase } from '../utils/mongodb'
import { ObjectId, UpdateFilter } from 'mongodb'
import { ChatBot } from '../types/ChatBot'
import { ChatGetInfo } from '../types/Api'
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

const ChatDefaultRouter = Router()

const handleAddChat: RequestHandler<{ id: string }> = async (req, res) => {
	try {
		const { id } = req.params
		const { isDefault } = req.body || false
		const objectId = new ObjectId(id)

		const db = getDatabase()
		const chatCollection = db.collection<Chat>('chat')
		const chatResult = await chatCollection.insertOne({
			chatBotId: objectId,
			messages: [],
		})

		if (chatResult) {
			const chatbotCollection = db.collection<ChatBot>('chatbot')

			const updateFilter: UpdateFilter<ChatBot> = {
				$set: {
					defaultChatId: chatResult.insertedId,
				},
			}

			const chatbotResult = await chatbotCollection.updateOne(
				{ _id: ObjectId },
				updateFilter
			)
			if (chatbotResult.modifiedCount > 0) {
				res.json({
					msg: 'Chat added!!!',
					chatId: chatResult.insertedId,
				})
			} else {
				throw Error('Error adding Chat!!')
			}
		} else {
			throw Error('Unavilable to add chat')
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

const handleGetChatInfo: RequestHandler<{ id: string }> = async (req, res) => {
	try {
		const { id } = req.params
		const chatObjectId = new ObjectId(id)

		const db = getDatabase()
		const chatCollection = db.collection<Chat>('chat')
		const chatBotCollection = db.collection<ChatBot>('chatbot')

		const chatResult = await chatCollection.findOne({ _id: chatObjectId })

		if (chatResult) {
			const chatBotResult = await chatBotCollection.findOne({ _id: chatResult.chatBotId })
			if (chatBotResult) {
				const result: ChatGetInfo = {
					chatBot: chatBotResult,
					messages: chatResult.messages,
				}
				res.json(result)
			}
		} else {
			res
				.json({
					msg: 'Chat not founded',
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

const handleDeleteAllMessages: RequestHandler<{ id: string }> = async (req, res) => {
	try {
		const { id } = req.params
		const objectId = new ObjectId(id)

		const db = getDatabase()
		const collection = db.collection<Chat>('chat')
		const result = await collection.updateOne(
			{ _id: objectId },
			{
				$set: {
					messages: [],
				},
			}
		)

		if (result.modifiedCount > 0) {
			res.json({
				msg: 'Messages removed!!',
			})
		} else {
			res
				.json({
					msg: 'Chat not found',
				})
				.status(400)
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

const handleChat: RequestHandler<{}, {}, { id: string; messages: Message[] }> = async (
	req,
	res
) => {
	try {
		const { id, messages } = req.body
		const objectId = new ObjectId(id)

		const db = getDatabase()
		const chatCollection = db.collection<Chat>('chat')
		const chatResult = await chatCollection.findOne({ _id: objectId })

		if (!chatResult) throw Error('Error fetching messages')

		const chatBotCollection = db.collection<ChatBot>('chatbot')
		const chatBotResult = await chatBotCollection.findOne({ _id: chatResult.chatBotId })

		if (!chatBotResult) throw Error('Error fetching chatbot settings')

		const result = streamText({
			model: openai(chatBotResult.model),
			messages,
			system: chatBotResult.initialPrompt,
			onFinish: async ({ text, response }) => {
				await chatCollection.updateOne(
					{ _id: objectId },
					{
						$set: {
							messages: [...messages, { role: 'assistant', content: text }],
						},
					}
				)
			},
		})

		result.pipeDataStreamToResponse(res)
	} catch (error) {
		console.log(error)
		res
			.json({
				msg: 'Error',
			})
			.status(501)
	}
}

ChatDefaultRouter.get('/info/:id', handleGetChatInfo)
ChatDefaultRouter.post('/add/:id', handleAddChat)
ChatDefaultRouter.post('/', handleChat)
ChatDefaultRouter.delete('/messages/:id', handleDeleteAllMessages)

export default ChatDefaultRouter
