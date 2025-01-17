import { z } from 'zod'

export const addChatSchema = {
	body: z.object({
        chatBotId: z.string(),
        userId: z.string()
    }),
}

export const chatSchema = {
    params: z.object({
        chatId: z.string()
    }),
    body: z.object({
        messages: z.string().array().or(z.any()),
        contactName: z.string().optional(),
        stream: z.boolean().optional().default(false)
    })
}

export const getChatInfoByIdSchema = {
    params: z.object({
        chatId: z.string()
    })
}

export const searchChatSchema = {
    body: z.object({
        botId: z.string(),
        userId: z.string()
    })
}

export const generateLinkSchema = {
    params: z.object({
        id: z.string()
    })
}