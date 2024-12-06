export interface ChatBot {
    name: string
    model: string
    initialPrompt: string
    defaultChatId?: string
    chatsId?: string[]
}

export interface ChatBotRecord extends ChatBot {
    _id: string
}