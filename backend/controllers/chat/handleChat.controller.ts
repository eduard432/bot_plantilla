import {
	CoreAssistantMessage,
	CoreMessage,
	CoreTool,
	CoreToolMessage,
	CoreUserMessage,
	generateText,
	LanguageModelResponseMetadata,
	LanguageModelUsage,
	streamText,
} from 'ai'
import { RequestHandler } from 'express'
import { getDatabase } from '../../utils/mongodb'
import { ObjectId } from 'mongodb'
import { Chat } from '../../types/Chat'
import { ChatBot } from '../../types/ChatBot'
import { aiPlugins } from '../../ai/plugins'
import { openai } from '@ai-sdk/openai'

const handleChat: RequestHandler<
	{ chatId: string },
	{},
	{
		messages: CoreUserMessage[]
		contactName?: string
		stream: boolean
		allMessages: boolean
	}
> = async (req, res) => {
	try {
		const { chatId } = req.params
		const { messages, contactName, stream, allMessages } = req.body

		console.log({ messages })

		const chatObjectId = new ObjectId(chatId)

		const db = getDatabase()

		const chatCollection = db.collection<Chat>('chat')
		const chatBotCollection = db.collection<ChatBot>('chatbot')

		const chatResult = await chatCollection.findOne({
			_id: chatObjectId,
		})

		if (chatResult) {
			const chatBotResult = await chatBotCollection.findOne({
				_id: chatResult.chatBotId,
			})

			if (chatBotResult) {
				const { model, initialPrompt, name, tools: toolsId } = chatBotResult

				const conversation: CoreMessage[] = !allMessages
					? [...chatResult.messages, ...messages]
					: messages

				const tools: { [key: string]: CoreTool } = {}

				for (let i = 0; i < toolsId.length; i++) {
					const toolId = toolsId[i]
					const tool = aiPlugins[toolId]
					tools[toolId] = tool
				}

				console.log({conversation})

				// const aiConfig = 

				if (stream) {
					const result = streamText({
						model: openai(model),
						messages: conversation,
						system: `${name} - ${initialPrompt},
						${contactName && 'Acualmente estás ayudando a: ' + contactName}`,
						onFinish: async ({
							usage,
							response,
						}: {
							usage: LanguageModelUsage
							response: LanguageModelResponseMetadata & {
								messages: Array<CoreAssistantMessage | CoreToolMessage>
							}
						}) => {
							const { messages: aiMessages } = response
							console.log({aiMessages})
	
							await chatCollection.updateOne(
								{ _id: chatObjectId },
								{
									$push: {
										messages: {
											$each: [messages[0], ...aiMessages],
										},
									},
									$inc: {
										usedTokens: usage.totalTokens,
									},
								}
							)
						},
						tools,
						maxSteps: 3,
					})

					result.pipeDataStreamToResponse(res)
				} else {
					const { text } = await generateText({
						model: openai(model),
						messages: conversation,
						system: `${name} - ${initialPrompt},
						${contactName && 'Acualmente estás ayudando a: ' + contactName}`,
						onStepFinish: async ({
							usage,
							response,
						}: {
							usage: LanguageModelUsage
							response: LanguageModelResponseMetadata & {
								messages: Array<CoreAssistantMessage | CoreToolMessage>
							}
						}) => {
							const { messages: aiMessages } = response
							console.log({aiMessages})
	
							await chatCollection.updateOne(
								{ _id: chatObjectId },
								{
									$push: {
										messages: {
											$each: [messages[0], ...aiMessages],
										},
									},
									$inc: {
										usedTokens: usage.totalTokens,
									},
								}
							)
						},
						tools,
						maxSteps: 3,
					})

					res.json({
						response: text,
					})
				}
			}
		} else {
			res
				.json({
					msg: 'Chat not founded',
				})
				.status(404)
		}
	} catch (error) {
		console.log(error)
		res
			.json({
				msg: 'Error',
			})
			.status(501)
	}
}

export default handleChat
