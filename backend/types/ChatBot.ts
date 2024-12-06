import { ObjectId } from 'mongodb'

export interface ChatBot {
    name: string
    model: string
    initialPrompt: string
    defaultChatId?: ObjectId
    chats?: ObjectId[]
}