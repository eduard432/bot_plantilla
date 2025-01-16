import { RequestHandler } from 'express'
import { ObjectId } from 'mongodb'
import { getDatabase } from '../../utils/mongodb'
import { ChatBot } from '../../types/ChatBot'

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
