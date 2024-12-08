import { RequestHandler, Router } from 'express'
import { Chat } from '../types/Chat'
import { getDatabase } from '../utils/mongodb'
import { ObjectId, UpdateFilter } from 'mongodb'
import { ChatBot } from '../types/ChatBot'
import { ChatGetInfo } from '../types/Api'
import { generateText, streamText } from 'ai'
import { openai } from '@ai-sdk/openai';

const ChatRouter = Router()

const handleAddChat: RequestHandler<{ id: string }, {}, { isDefault: boolean }> = async (
	req,
	res
) => {
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

			const updateFilter: UpdateFilter<ChatBot> = isDefault
				? {
						$set: {
							defaultChatId: chatResult.insertedId,
						},
				  }
				: {
						$push: {
							chats: chatResult.insertedId,
						},
				  }

			const chatbotResult = await chatbotCollection.updateOne(
				{ _id: ObjectId },
				updateFilter
			)
			if (chatbotResult.modifiedCount > 0) {
				res.json({
					msg: 'Chat added!!!',
					chatId: chatResult.insertedId
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

const handleGetChatInfo:RequestHandler<{id: string}> = async (req, res) => {
	try {
		const { id } = req.params
		const chatObjectId = new ObjectId(id)
		
		const db = getDatabase()
		const chatCollection = db.collection<Chat>('chat')
		const chatBotCollection = db.collection<ChatBot>('chatbot')

		const chatResult = await chatCollection.findOne({_id: chatObjectId})

		if (chatResult){
			const chatBotResult = await chatBotCollection.findOne({_id: chatResult.chatBotId})
			if (chatBotResult) {
				const result: ChatGetInfo = {
					chatBot: chatBotResult,
					messages: chatResult.messages
				}
				res.json(result)
			}
		} else {
			res.json({
				msg: 'Chat not founded'
			}).status(404)
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

const handleChat: RequestHandler<{}, {}, {id: string, message: string}> = async (req, res) => {
	try {
		const { id, message } = req.body
		const objectId = new ObjectId(id)

		const db = getDatabase()
		const chatCollection = db.collection<Chat>('chat')
		const chatResult = await chatCollection.findOne({_id: objectId})

		if(!chatResult) throw Error('Error fetching messages')

		const { messages } = chatResult

		const result = streamText({
			model: openai('gpt-3.5-turbo'),
			messages
		})

		result.pipeDataStreamToResponse(res)

	} catch (error) {
		console.log(error)
		res.json({
			msg: 'Error'
		})
		.status(501)
	}
}

ChatRouter.get('/info/:id', handleGetChatInfo)
ChatRouter.post('/add/:id', handleAddChat)
ChatRouter.post('/', handleChat)

export default ChatRouter