import { RequestHandler, Router } from 'express'
import { Chat, Message } from '../types/Chat'
import { getDatabase } from '../utils/mongodb'
import { ObjectId } from 'mongodb'
import { ChatBot } from '../types/ChatBot'
import { ChatGetInfo } from '../types/Api'
import { ChatCompletionMessageParam } from 'openai/resources'
import { openai } from '../ai/openai'
import { aiPlugins } from '../ai/plugins'

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

		console.log('Chat insert result:', chatResult)

		if (chatResult) {
			const chatBotResult = await chatBotCollection.updateOne(
				{ _id: chatBotObjectId },
				{ $push: { chats: chatResult.insertedId } }
			)

			console.log('Chatbot update result:', chatBotResult)

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
	{ messages: Message[]; contactName?: string }
> = async (req, res) => {
	try {
		const { chatId } = req.params
		const { messages, contactName } = req.body

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

				const conversation: ChatCompletionMessageParam[] = [
					{
						role: 'system',
						content: `${name} - ${initialPrompt},
					${contactName && 'Acualmente estás ayudando a: ' + contactName}
					`,
					},
					...chatResult.messages,
					...messages,
				]

				const tools = chatBotResult.tools.map((toolId) => {
					const tool = aiPlugins[toolId].schema
					return tool
				})

				const completion = await openai.chat.completions.create({
					model,
					messages: conversation,
					tools,
				})

				let responseText = ''

				responseText = completion.choices[0].message.content || ''

				const newConversation = [...messages]

				

				console.log({completion: JSON.stringify(completion)})

				if(completion.choices[0].message.tool_calls && completion.choices[0].message.tool_calls.length > 0) {
					const toolCall = completion.choices[0].message.tool_calls[0]
					const {...args} = JSON.parse(toolCall.function.arguments)
					const pluginResult = await aiPlugins[toolCall.function.name].func(args)
					responseText = pluginResult
				}

				if (responseText) {
					newConversation.push({
						role: 'assistant',
						content: responseText,
					})
				}

				chatCollection.updateOne(
					{ _id: chatObjectId },
					{
						$push: {
							messages: {
								$each: newConversation,
							},
						},
					}
				)

				res.json({
					response: responseText,
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
