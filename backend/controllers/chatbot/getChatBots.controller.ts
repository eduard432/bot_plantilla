import { RequestHandler } from "express"
import { getDatabase } from "../../utils/mongodb"
import { ChatBot } from "../../types/ChatBot"

export const handleGetChatbots: RequestHandler = async (req, res) => {
    try {
        const db = getDatabase()
        const collection = db.collection<ChatBot>('chatbot')
        const result = await collection.find({}).toArray()
        if (result) {
            res.json(result)
        } else {
            res
                .json({
                    msg: 'Files not found',
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