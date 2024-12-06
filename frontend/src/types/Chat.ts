
export interface Message {
    role: string,
    content: string
}

export interface Chat {
    chatBotId: string,
    messages: Message[]
}