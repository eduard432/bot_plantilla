import { prompt } from 'enquirer'
import { ChatBot } from './types/ChatBot'
import fsSync from 'fs'
import fs from 'fs/promises'
import { Settings, ValidContacts } from './types/Settings'
import { Chat, Client } from 'whatsapp-web.js'

const getChatBot = async (botId: string) => {
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

const getSettings = async (): Promise<Settings | undefined> => {
	const existsFile = fsSync.existsSync('./settings.json')
	if (!existsFile) {
		await fs.writeFile('./settings.json', '{}')
		return undefined
	}
	const data = await fs.readFile('./settings.json', 'utf-8')
	const settings = await JSON.parse(data)
	return settings
}

const saveSettings = async (newSettings: Settings) => {
	await fs.writeFile('./settings.json', JSON.stringify(newSettings, null, 2), 'utf-8')
}

const setupSettings = async (client: Client) => {
	const settings = await getSettings()

	if (!settings) return

	console.log(JSON.stringify(settings, null, 2))

	const { setDefaultBot } = await prompt<{ setDefaultBot: boolean }>({
		type: 'confirm',
		name: 'setDefaultBot',
		message: '¿Desea usar este configuracion?',
	})

	if (setDefaultBot) return

	const newSettings = { ...settings }

	let chatBot: undefined | ChatBot

	while (!chatBot) {
		const { botId } = await prompt<{ botId: string }>({
			type: 'input',
			name: 'botId',
			message: 'Ingresa el id de tu chatbot',
		})

		chatBot = await getChatBot(botId)
	}

	newSettings.chatBot

	const { setToAllContacts } = await prompt<{ setToAllContacts: boolean }>({
		type: 'confirm',
		name: 'setToAllContacts',
		message: '¿Desea configurar este bot para todos sus contactos?',
	})

	if (setToAllContacts) {
		newSettings.validContacts = 'all'
	} else {
		const contactNumbers = (await client.getContacts()).map((contact) => {
			return {
				name: contact.name || contact.pushname || contact.number,
				value: contact.id._serialized,
			}
		})

		const { contacts } = await prompt<{ contacts: string }>({
			name: 'contacts',
			type: 'autocomplete',
			message: 'Eliga los contactos autorizados:',
			choices: contactNumbers,
			multiple: true,
			result: (contactsNames) => {
				const newContacts = []
				for (let i = 0; i < contactsNames.length; i++) {
					const contactName = contactsNames[i]
					const index = contactNumbers.findIndex(
						(searchValue) => searchValue.name == contactName
					)
					if (index > -1) {
						newContacts.push(contactNumbers[index].value)
					} 
				}
				return newContacts.join(',')
			},
		})
		newSettings.validContacts = contacts.split(',')
	}

	await saveSettings(newSettings)
	console.clear()
	console.log('Configuracion terminada, listo para recibir mensajes')
}

const saveInitialSettings = async (client: Client) => {
	const { info } = client
	const userId = info.wid
	const number = await client.getFormattedNumber(userId._serialized)
	const settings = await getSettings()
	const waSettings = {
		phoneNumber: number,
		authSessionPath: './auth_session',
	}
	if (settings) {
		saveSettings({ ...settings, waSettings })
	} else {
		saveSettings({ waSettings })
	}
}

const defaultMenu = async (client: Client) => {
	const settings = await getSettings()

	if (settings && settings.waSettings.phoneNumber) {
		const { phoneNumber } = settings.waSettings

		const { defaultPhoneNumber } = await prompt<{ defaultPhoneNumber: boolean }>({
			type: 'confirm',
			name: 'defaultPhoneNumber',
			message: `¿Quiere usar el número previamente guardado? (${phoneNumber})`,
			initial: true,
		})

		console.log(defaultPhoneNumber)
		if (!defaultPhoneNumber) {
			console.log('exec')
			await fs.rm('/.wwebjs_auth', { recursive: true, force: true })
		}
	}

	await client.initialize()
}

export { defaultMenu, saveInitialSettings, setupSettings }
