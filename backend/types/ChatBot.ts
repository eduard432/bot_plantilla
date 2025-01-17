import { ObjectId } from 'mongodb'
import { z } from 'zod'
import { ChatBotSchema } from '../validators/chatbot.validator'

export type ConnectionType = 'wa' | 'disc'

export type Connection = {
    type: string
    chatsId: ObjectId[]
}

export type Connections = {
    [key: string]: Connection
}

export interface ChatBot {
    name: string
    model: string
    initialPrompt: string
    defaultChatId: ObjectId
    connections: Connections
    tools: string[]
    usedTokens: number
}