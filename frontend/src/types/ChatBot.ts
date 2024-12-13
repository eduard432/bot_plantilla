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
    chatsId?: string[]
    connections: Connections
}

export interface ChatBotRecord extends ChatBot {
    _id: string
}