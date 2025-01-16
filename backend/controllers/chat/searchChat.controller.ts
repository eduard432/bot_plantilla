import { RequestHandler } from "express";
import { getDatabase } from "../../utils/mongodb";
import { ObjectId } from "mongodb";
import { Chat } from "../../types/Chat";

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

export default handleSearchChat