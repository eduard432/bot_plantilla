import { z } from 'zod'

export const getStatsSchema = {
	params: z.object({
		id: z.string(),
	}),
}

export const addConnectionSchema = {
    body: z.object({
        id: z.string(),
        type: z.enum(['wa', 'disc'])
    })
}

export const deleteConnectionSchema = {
    body: z.object({
        id: z.string(),
        type: z.enum(['wa', 'disc'])
    })
}

export const addPluginSchema = {
    body: z.object({
        botId: z.string(),
        plugin: z.string()
    })
}

export const deletePluginSchema = {
    body: z.object({
        botId: z.string(),
        plugin: z.string()
    })
}

export const createChatbotSchema = {
    body: z.object({
        model: z.string(),
        name: z.string(),
        initialPrompt: z.string()
    })
}

export const getChatbotSchema = {
    params: z.object({
        id: z.string()
    })
}

export const updateChatbotsSchema = {
    params: z.object({
        id: z.string()
    }),
    body: z.object({
        model: z.string().optional(),
        name: z.string().optional(),
        initialPrompt: z.string().optional()
    }).optional()
}

export const deleteChatbotSchema = {
    params: z.object({
        id: z.string()
    })
}
