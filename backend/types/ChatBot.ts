import { ObjectId, WithId } from 'mongodb'
import { Chat } from './Chat'

export interface ChatBot {
    name: string
    model: string
    initialPrompt: string
    defaultChatId?: ObjectId
    chats?: ObjectId[]
}

export type ChatBotRecord = WithId<ChatBot>