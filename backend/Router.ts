import { RequestHandler, Router } from 'express'
import { ChatBot, ChatBotRecord } from '../types/ChatBot'
import { deleteObject, getAllObjects, getObject, saveObject, updateObject } from './utils/dbService'

const ChatBotRouter = Router()

const handleCreateChatBot: RequestHandler<{}, {}, ChatBot> = async (req, res) => {
	const { model, name } = req.body
    const id = await saveObject({model, name}, 'chatbot')

    res.json({
        msg: 'Chatbot created',
        id
    }).status(201)
}

const handleGetChatbot: RequestHandler<{id: string}> = async (req, res) => {
    const { id } = req.params
    const data = await getObject<ChatBotRecord>(id, 'chatbot')
    if(data) {
        res.json(data)
    } else {
        res.json({
            msg: 'File not found'
        }).status(404)
    }
}

const handleGetChatbots: RequestHandler = async (req, res) => {
    const data = await getAllObjects<ChatBotRecord>('chatbot')
    res.json(data)
}

const handleUpdateChatbots: RequestHandler<{id: string}, {}, ChatBot> = async (req, res) => {
    const { id } = req.params
    const { name, model } = req.body
    const result = await updateObject(id, 'chatbot', { name, model })
    if(result) {
        res.json({
            msg: 'Chatbot updated!!!'
        })
    } else {
        res.json({
            msg: 'Error updating chatbot!!'
        })
    }

}

const handleDeleteChatbot: RequestHandler<{id: string}> = async (req, res) => {
    const {id} = req.params
    const result = await deleteObject(id, 'chatbot')
    if(result) {
        res.json({
            msg: 'Chatbot removed!!!'
        })
    } else {
        res.json({
            msg: 'Error trying to remove chatbot!!'
        })
    }
}

ChatBotRouter.post('/', handleCreateChatBot)
ChatBotRouter.get('/all', handleGetChatbots)
ChatBotRouter.get('/:id', handleGetChatbot)
ChatBotRouter.put('/:id', handleUpdateChatbots)
ChatBotRouter.delete('/:id', handleDeleteChatbot)

export default ChatBotRouter