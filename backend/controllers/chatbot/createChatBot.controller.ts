import { ObjectId } from "mongodb"
import { getDatabase } from "../../utils/mongodb"
import { RequestHandler } from "express"
import { ChatBot } from "../../types/ChatBot"
import { Chat } from "../../types/Chat"

export const handleCreateChatBot: RequestHandler<{}, {}, ChatBot> = async (req, res) => {
    try {
        const { model, name, initialPrompt } = req.body

        const chatBotId = new ObjectId()
        const chatId = new ObjectId()

        const db = getDatabase()
        const chatBotCollection = db.collection<ChatBot>('chatbot')
        const chatCollection = db.collection<Chat>('chat')

        const chatBot = {
            _id: chatBotId,
            model,
            name,
            initialPrompt,
            defaultChatId: chatId,
            connections: {},
            chats: [],
            tools: [],
            usedTokens: 0,
        }
        const chatBotResult = await chatBotCollection.insertOne(chatBot)

        await chatCollection.insertOne({ _id: chatId, chatBotId: chatBotId, messages: [] })

        if (chatBotResult) {
            res
                .json({
                    msg: 'Chatbot created',
                    chatBot: chatBot,
                })
                .status(201)
        } else {
            throw Error('Error trying to create chatbot')
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