import { ObjectId } from "mongodb"

export interface Message {
    role: 'system' | 'user' | 'assistant' | 'data',
    content: string
}

export interface Chat {
    chatBotId: ObjectId,
    messages: Message[]
}