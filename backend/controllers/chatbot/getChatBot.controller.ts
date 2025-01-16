import { RequestHandler } from "express"
import { ObjectId } from "mongodb"
import { getDatabase } from "../../utils/mongodb"
import { ChatBot } from "../../types/ChatBot"

export const handleGetChatbot: RequestHandler<{ id: string }> = async (req, res) => {
    try {
        const { id } = req.params
        const objectId = new ObjectId(id)

        const db = getDatabase()
        const collection = db.collection<ChatBot>('chatbot')
        const result = await collection.findOne({ _id: objectId })
        if (result) {
            res.json(result)
        } else {
            res
                .json({
                    msg: 'File not found',
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