import { RequestHandler } from "express";
import { getDatabase } from "../../utils/mongodb";
import { ChatBot } from "../../types/ChatBot";
import { ObjectId } from "mongodb";

export const handleAddPlugin: RequestHandler<{}, {}, { botId: string; plugin: string }> = async (req, res) => {
    try {
        const { botId, plugin } = req.body

        const db = getDatabase()
        const collection = db.collection<ChatBot>('chatbot')
        const objectId = new ObjectId(botId)

        const query = {
            _id: objectId,
            tools: { $nin: [plugin] },
        }


        const update = {
            $push: {
                tools: plugin,
            },
        }

        const result = await collection.updateOne(query, update)

        console.log({result})

        if (result.modifiedCount > 0) {
            res.json({
                msg: 'Chatbot updated!!!',
            })
        } else {
            res.json({
                msg: 'Chatbot not updated'
            })
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