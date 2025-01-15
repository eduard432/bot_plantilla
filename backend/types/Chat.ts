import { CoreMessage, CoreUserMessage } from "ai"
import { ObjectId } from "mongodb"


export interface Message {
    role: 'system' | 'user' | 'assistant',
    content: string
}

export interface Chat {
    chatBotId: ObjectId,
    messages: CoreMessage[]
    userId?: string
}