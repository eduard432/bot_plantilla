import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import { initDatabase } from './utils/dbService'
import ChatBotRouter from './Router'

dotenv.config()

const PORT = process.env.PORT || 3000
const app = express()

app.disable('x-powered-by')
app.use(express.json(), cors(), morgan('dev'))

app.use('/chatbot', ChatBotRouter)

app.listen(PORT, async () => {
    await initDatabase('./db')
    console.log(`Server listening in port: ${PORT}`)
})