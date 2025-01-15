import { RequestHandler, Router } from 'express'
import { Chat } from '../types/Chat'
import { getDatabase } from '../utils/mongodb'
import { ObjectId } from 'mongodb'
import { ChatBot } from '../types/ChatBot'
import { openai as openaiSdk } from '@ai-sdk/openai'
import { aiPlugins } from '../ai/plugins'
import { CoreMessage, generateText, CoreTool, CoreUserMessage } from 'ai'

const ChatRouter = Router()

const handleAddChat: RequestHandler<
	{},
	{},
	{ chatBotId: string; userId: string }
> = async (req, res) => {
	try {
		const { chatBotId, userId } = req.body
		const chatBotObjectId = new ObjectId(chatBotId)

		const db = getDatabase()

		const chatCollection = db.collection<Chat>('chat')
		const chatBotCollection = db.collection<ChatBot>('chatbot')

		const chatResult = await chatCollection.insertOne({
			chatBotId: chatBotObjectId,
			userId,
			messages: [],
		})

		if (chatResult) {
			const chatBotResult = await chatBotCollection.updateOne(
				{ _id: chatBotObjectId },
				{ $push: { chats: chatResult.insertedId } }
			)

			if (chatBotResult.modifiedCount > 0) {
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

const handleGetChatInfoById: RequestHandler<{ chatId: string }> = async (req, res) => {
	try {
		const { chatId } = req.params
		const chatObjectId = new ObjectId(chatId)

		const db = getDatabase()
		const chatCollection = db.collection<Chat>('chat')
		const chatBotCollection = db.collection<ChatBot>('chatbot')

		const chatResult = await chatCollection.findOne({ _id: chatObjectId })

		if (chatResult) {
			const chatBotResult = await chatBotCollection.findOne({ _id: chatResult.chatBotId })
			if (chatBotResult) {
				const result = {
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

const handleSearchChat: RequestHandler<
	{},
	{},
	{},
	{ userId: string; botId: string }
> = async (req, res) => {
	try {
		const { botId, userId } = req.query
		const db = getDatabase()
		const chatCollection = db.collection<Chat>('chat')

		const chatResult = await chatCollection.findOne({
			chatBotId: new ObjectId(botId),
			userId,
		})

		if (chatResult) {
			res.json({
				msg: 'Chat founded',
				chat: chatResult._id,
			})
		} else {
			res
				.json({
					msg: 'Chat not founded',
				})
				.status(404)
		}
	} catch (error) {
		console.log(error)
		res.status(500)
	}
}

const handleChat: RequestHandler<
	{ chatId: string },
	{},
	{ messages: string[]; contactName?: string }
> = async (req, res) => {
	try {
		const { chatId } = req.params
		const { messages: userMessages, contactName } = req.body
		const messages: CoreUserMessage[] = userMessages.map((message) => {
			return {
				role: 'user',
				content: message,
			}
		})

		const chatObjectId = new ObjectId(chatId)

		const db = getDatabase()

		const chatCollection = db.collection<Chat>('chat')
		const chatBotCollection = db.collection<ChatBot>('chatbot')

		const chatResult = await chatCollection.findOne({
			_id: chatObjectId,
		})

		if (chatResult) {
			const chatBotResult = await chatBotCollection.findOne({
				_id: chatResult.chatBotId,
			})

			if (chatBotResult) {
				const { model, initialPrompt, name, tools: toolsId } = chatBotResult

				const conversation: CoreMessage[] = [...chatResult.messages, ...messages]

				const tools: { [key: string]: CoreTool } = {}

				for (let i = 0; i < toolsId.length; i++) {
					const toolId = toolsId[i]
					const tool = aiPlugins[toolId]
					tools[toolId] = tool
				}

				const { text } = await generateText({
					model: openaiSdk(model),
					messages: conversation,
					system: `${name} - ${initialPrompt},
					${contactName && 'Acualmente estás ayudando a: ' + contactName}`,
					onStepFinish: async ({ usage, response }) => {
						const { messages: aiMessages } = response

						await chatCollection.updateOne(
							{ _id: chatObjectId },
							{
								$push: {
									messages: {
										$each: [...messages, ...aiMessages],
									},
								},
								$inc: {
									usedTokens: usage.totalTokens,
								},
							}
						)
					},
					tools,
					maxSteps: 3,
				})

				res.json({
					response: text,
				})
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

ChatRouter.post('/add', handleAddChat)
ChatRouter.post('/:chatId', handleChat)
ChatRouter.get('/info/:chatId', handleGetChatInfoById)
ChatRouter.get('/search', handleSearchChat)

export default ChatRouter
