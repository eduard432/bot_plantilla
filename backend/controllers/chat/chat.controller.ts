import { RequestHandler } from 'express'
import { ObjectId, WithId } from 'mongodb'
import { getDatabase } from '../../utils/mongodb'
import { Chat } from '../../types/Chat'
import { ChatBot } from '../../types/ChatBot'
import { Message } from 'ai'
import { ENV } from '../../env'

export const handleAddChat: RequestHandler<
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

export const handleGetChatInfoById: RequestHandler<{ chatId: string }> = async (
	req,
	res
) => {
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
				const messages: Message[] = []

				chatResult.messages.forEach(({ role, content }) => {
					if (role !== 'tool') {
						const id = new ObjectId().toString()
						if (typeof content === 'string') {
							messages.push({
								role,
								content,
								id,
							})
						} else {
							content.forEach((subContent) => {
								if (subContent.type === 'text') {
									messages.push({
										role,
										content: subContent.text,
										id,
									})
								}
							})
						}
					}
				})

				const result: {
					chatBot: WithId<ChatBot>
					messages: Message[]
				} = {
					chatBot: chatBotResult,
					messages,
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

export const handleSearchChat: RequestHandler<
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

export const handleGenerateLink: RequestHandler<{id: string}> = async (req, res) => {
    try {
        const { id } = req.params
        const chatBotObjectId = new ObjectId(id)

        const db = getDatabase()

        const chatCollection = db.collection<Chat>('chat')
        const chatBotCollection = db.collection<ChatBot>('chatbot')

        const chatResult = await chatCollection.insertOne({
            chatBotId: chatBotObjectId,
            userId: '',
            messages: []
        })

        if (chatResult) {
            const chatBotResult = await chatBotCollection.updateOne(
				{ _id: chatBotObjectId },
				{ $push: { chats: chatResult.insertedId } }
			)

            if (chatBotResult.modifiedCount > 0) {
				res.redirect(`${ENV.FRONTEND_URL}/chat/${chatResult.insertedId.toString()}`)
			} else {
				throw Error('Error adding Chat!!')
			}
        }else {
			throw Error('Unavilable to add chat')
		}


    } catch (error) {
		console.log(error)
		res.status(500)
	}
}