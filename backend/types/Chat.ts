import { ObjectId } from "mongodb"

export interface Message {
    role: string,
    content: string
}

export interface Chat {
    chatBotId: ObjectId,
    messages: Message[]
}