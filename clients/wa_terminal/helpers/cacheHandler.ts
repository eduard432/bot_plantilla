import fs from 'fs/promises'
import chalk from 'chalk'

const MEMORY_PHONE_PATH = './response_memory.json'

const readPhoneCache = async () => {
	const responseMemoryString = await fs.readFile(MEMORY_PHONE_PATH, 'utf-8')
	const responseMemoryFile: string[] = JSON.parse(responseMemoryString)
	return [...responseMemoryFile]
}

const writePhoneCache = async (phone: string, op: 'add' | 'remove') => {
	const pastMemory = await readPhoneCache()
	if (op == 'add') {
		const newMemory = [...pastMemory, phone]
		await fs.writeFile(MEMORY_PHONE_PATH, JSON.stringify(newMemory))
	} else {
		const index = pastMemory.indexOf(phone)

		if (index > -1) {
			pastMemory.splice(index, 1)
			await fs.writeFile(MEMORY_PHONE_PATH, JSON.stringify(pastMemory))
		}
	}
}

const clearPhoneCache = async () => {
	await fs.writeFile(MEMORY_PHONE_PATH, '[]')
	console.log(chalk.yellow(`[SERVER]: Memory Phone Cleaned!!`))
}

export {
    readPhoneCache,
    writePhoneCache,
    clearPhoneCache
}