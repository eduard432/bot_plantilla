import { ObjectId } from 'mongodb'
import { ChatCompletionTool } from 'openai/resources'

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
}