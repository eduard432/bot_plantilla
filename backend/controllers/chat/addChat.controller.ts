import { RequestHandler } from "express";
import { ObjectId } from "mongodb";
import { getDatabase } from "../../utils/mongodb";
import { Chat } from "../../types/Chat";
import { ChatBot } from "../../types/ChatBot";

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

export default handleAddChat