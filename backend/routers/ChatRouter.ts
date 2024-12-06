import { RequestHandler, Router } from 'express'
import { Chat } from '../types/Chat'
import { getDatabase } from '../utils/mongodb'
import { ObjectId, UpdateFilter } from 'mongodb'
import { ChatBot } from '../types/ChatBot'

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
				})
			} else {
				res.json({
					msg: 'Error adding Chat!!',
				})
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

ChatRouter.post('/add/:id', handleAddChat)

export default ChatRouter