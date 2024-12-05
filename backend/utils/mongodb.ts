import { Db, MongoClient } from 'mongodb'
let db: Db

export async function connectToDatabase() {
	try {
		const uri = process.env.MONGODB_URL

		const client = new MongoClient(uri || '')
		client.on('connectionReady', () => {
			console.log('Connection ready!!')
		})

		if (!db) {
			await client.connect() // Conecta al cliente si no está conectado
			db = client.db('chatbot_db') // Inicializa la base de datos
		}
		return db
	} catch (error) {
		console.error('Error al conectar a la base de datos:', error)
		throw error
	}
}

export function getDatabase() {
    if (!db) {
      throw new Error("La base de datos no está inicializada. Llama primero a initMongoDB.");
    }
    return db;
  }