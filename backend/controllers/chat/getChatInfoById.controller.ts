import { RequestHandler } from "express"
import { ObjectId } from "mongodb"
import { getDatabase } from "../../utils/mongodb"
import { Chat } from "../../types/Chat";
import { ChatBot } from "../../types/ChatBot";

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

export default handleGetChatInfoById