import { RequestHandler } from "express";
import { ChatBot, ConnectionType } from "../../types/ChatBot";
import { ObjectId, UpdateFilter } from "mongodb";
import { getDatabase } from "../../utils/mongodb";


export const handleAddConnection: RequestHandler<
    {},
    {},
    { id: string; type: ConnectionType }
> = async (req, res) => {
    try {
        const { id, type } = req.body
        const objectId = new ObjectId(id)

        const db = getDatabase()
        const collection = db.collection<ChatBot>('chatbot')
        const path = `connections.${type}`

        const query = {
            _id: objectId,
            [path]: { $exists: false, $ne: true },
        }

        const update = {
            $set: {
                [path]: {
                    type,
                    chatsId: [],
                },
            },
        }

        const result = await collection.updateOne(query, update)

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
            .status(500)
    }
}

export const handleDeleteConnection: RequestHandler<
    {},
    {},
    { id: string; type: ConnectionType }
> = async (req, res) => {
    try {
        const { id, type } = req.body
        const objectId = new ObjectId(id)

        const db = getDatabase()
        const collection = db.collection<ChatBot>('chatbot')
        const path = `connections.${type}`

        const query = {
            _id: objectId,
            [path]: { $exists: true, $ne: true },
        }

        const update: UpdateFilter<ChatBot> = {
            $unset: {
                [path]: ""
            },
        }

        const result = await collection.updateOne(query, update)

        if (result.modifiedCount > 0) {
            res.json({
                msg: 'Chatbot updated!!!',
            })
        } else {
            res.json({
                msg: 'Chatbot not updated'
            }).status(400)
        }
    } catch (error) {
        console.log(error)
        res
            .json({
                msg: 'Error',
            })
            .status(500)
    }
}