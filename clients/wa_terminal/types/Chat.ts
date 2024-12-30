
export interface Message {
    role: 'system' | 'user' | 'assistant' | 'data',
    content: string
}

export interface MessageRecord extends Message {
    _id: string
}

export interface Chat {
    chatBotId: string,
    messages: Message[]
}