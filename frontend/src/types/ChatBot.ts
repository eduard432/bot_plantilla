export type ConnectionType = 'wa' | 'disc'

export type Connection = {
    type: string,
    chatsId: string[]
}

export type Connections = {
    [key: string]: Connection
}


export interface ChatBot {
    name: string
    model: string
    initialPrompt: string
    defaultChatId?: string
    connections: Connections,
    tools: string[]
}

export interface ChatBotRecord extends ChatBot {
    _id: string
}