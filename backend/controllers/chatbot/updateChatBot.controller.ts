import { RequestHandler } from "express"
import pickBy from "lodash.pickby"
import { ObjectId } from "mongodb"
import { getDatabase } from "../../utils/mongodb"
import { ChatBot } from "../../types/ChatBot"

export const handleUpdateChatbots: RequestHandler<{ id: string }, {}, ChatBot> = async (
    req,
    res
) => {
    try {
        const { id } = req.params
        const objectId = new ObjectId(id)
        const { name, model, initialPrompt } = req.body
        const updatedValues = pickBy({ name, model, initialPrompt })

        const db = getDatabase()
        const collection = db.collection<ChatBot>('chatbot')
        const result = await collection.updateOne({ _id: objectId }, { $set: updatedValues })

        if (result.modifiedCount > 0) {
            res.json({
                msg: 'Chatbot updated!!!',
            })
        } else {
            throw Error('Error updating chatbot!!')
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