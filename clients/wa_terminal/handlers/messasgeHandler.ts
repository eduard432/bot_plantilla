import WAWebJS from 'whatsapp-web.js'
// import chalk from 'chalk'
import { getSearchChat, handleChat, newChat } from '../api/apiService'
import { ENV } from '../env'

export const messageHandler = async (message: WAWebJS.Message) => {
	const phone = message.from
	console.log(`[CLIENT]: New message: ${message.id.id} - from - ${phone}`)

	// if(!settings.validContacts.includes(phone) && settings.validContacts !== 'all' ) return

	// Wait for multiple mesages
	// const responseMemoryBefore = await readPhoneCache()

	// if (!responseMemoryBefore.includes(phone)) {
	// 	await writePhoneCache(phone, 'add')
	// }

	if (message.hasMedia) return

	const chat = await message.getChat()
	const contact = await chat.getContact()
	const contactName = contact.name || ''

	const botId = ENV.CHATBOT_ID || ''
	console.log({botId})
	const chatServerResponse = await getSearchChat(message.from, botId)
	let chatBotId: string

	const content = message.body
	if (chatServerResponse?.chat) {
		chatBotId = chatServerResponse?.chat
	} else {
		const newChatServerResponse = await newChat(message.from, botId)
		if (!newChatServerResponse) return
		chatBotId = newChatServerResponse.chatId
	}

	const completion = await handleChat(
		chatBotId,
		[{ role: 'user', content }],
		contactName
	)


	if (!completion) return
	chat.sendMessage(completion.response)
}
