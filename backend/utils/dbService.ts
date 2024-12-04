import fsSync from 'fs'
import fs from 'fs/promises'
import { v4 as uuid } from 'uuid'

const createDir = async (path: string) => {
	const existsdDir = fsSync.existsSync(path)
	if (!existsdDir) {
		await fs.mkdir(path)
	}
}

export const initDatabase = async (path: string) => {
	await createDir(path)
	await createDir(path + '/chatbot')
}

export const saveObject = async (
	data: Object,
	colection: string
): Promise<string> => {
	const id = uuid()
	const dataString = JSON.stringify({ ...data, id }, null, 2)
	const path = `./db/${colection}/${id}.json`
	await fs.writeFile(path, dataString, 'utf-8')
	return id
}

export async function getObject<T>(
	id: string,
	collection: string
): Promise<T | null> {
    const path = `./db/${collection}/${id}.json`
	const dataString = await fs.readFile(path, 'utf-8')
    const existsdDir = fsSync.existsSync(path)
	if (existsdDir) {
		const data: T = await JSON.parse(dataString)
		return data
	}
	return null
}

export async function getAllObjects<T> (collection: string): Promise<T[]> {
    const path = `./db/${collection}`
    const existsdDir = fsSync.existsSync(path)
    if (existsdDir) {
		const filesPaths = await fs.readdir(path)
		if (filesPaths.length > 0) {

			const data: T[] = []
			for (let i = 0; i < filesPaths.length; i++) {
				const filePath = filesPaths[i];
				const fileDataString = await fs.readFile(`${path}/${filePath}`, 'utf-8')
				const fileData = await JSON.parse(fileDataString)
				data.push(fileData)
			}
			return data
		}
	}
    return []
}

export const updateObject = async (
	id: string,
	collection: string,
	newData: Object
): Promise<boolean> => {
	const path = `./db/${collection}/${id}.json`
	const existsFile = fsSync.existsSync(path)
	if (existsFile) {
		const dataString = JSON.stringify(newData)
		await fs.writeFile(path, dataString, 'utf-8')
		return true
	}
	return false
}

export const deleteObject = async (id: string, collection: string) => {
	const path = `./db/${collection}/${id}.json`
	const existsFile = fsSync.existsSync(path)
	if (existsFile) {
		await fs.rm(path)
		return true
	}
	return false
}
