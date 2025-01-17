import { RequestHandler } from "express"
import { getDatabase } from "../../utils/mongodb"
import { Chat } from "openai/resources"
import { ObjectId } from "mongodb"

export const handleGetStats: RequestHandler<{id: string}> = async (req, res) => {
	try {
		const { id } = req.params

		const db = getDatabase()
		const collection = db.collection<Chat>('chat')
		const objectId = new ObjectId(id)

		const chatCount = await collection.countDocuments({chatBotId: objectId})

		// Aggregate operation to count the number of messages
		const result = await collection.aggregate([
			{ $match: { chatBotId: objectId } },
			{ $unwind: '$messages' },
			{ $count: 'messages' },
		]).next()

		const messageCount = result ? result.messages : 0;

		res.json({
			chatCount,
			messageCount,
		})


	} catch (error) {
		console.log(error)
		res
			.json({
				msg: 'Error',
			})
			.status(500)
	}
}