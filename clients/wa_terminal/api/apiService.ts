import { Chat, Message } from "../types/Chat"
import { ChatBot } from "../types/ChatBot"


export const getChatBot = async (botId: string) => {
    const response = await fetch(`${process.env.API_URL}/chatbot/${botId}`)

    if (response.ok) {
        const chatBot: ChatBot = await response.json()
        if (chatBot) {
            return chatBot
        } else {
            console.log('Chatbot no encontrado!!')
        }
    }
}

export const newChat = async (userId: string, chatBotId: string) => {
    const response = await fetch(`${process.env.API_URL}/chat/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId,
            chatBotId
        })
    })

    if(response.ok) {
        const chat: {
            chatId: string
        } = await response.json()
        return chat
    } else {
        return undefined
    }
}

export const getSearchChat = async (userId: string, botId: string) => {
    const params = new URLSearchParams({
        userId,
        botId
    })
    const response = await fetch(`${process.env.API_URL}/chat/search?${params.toString()}`)

    if(response.status >= 400) return undefined

    if(response.ok) {
        const chat: {
            msg: string,
            chat: string
        } = await response.json()
        return chat
    } else {
        return undefined
    }
}

export const handleChat = async (chatId: string, messages: Message[], contactName?: string) =>{
    const response = await fetch(`${process.env.API_URL}/chat/${chatId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            messages,
            contactName
        })
    })

    if(response.ok) {
        const responseMessage: {
            response: string
        } = await response.json()
        return responseMessage
    }

}