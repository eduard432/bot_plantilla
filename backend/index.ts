import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import ChatBotRouter from './routers/ChatBotRouter'
import { connectToDatabase } from './utils/mongodb'
import ChatDefaultRouter from './routers/ChatDefaultRouter'
dotenv.config()



const PORT = process.env.PORT || 3000
const app = express()

app.disable('x-powered-by')
app.use(express.json(), cors(), morgan('dev'))

app.use('/chatbot', ChatBotRouter)
app.use('/chat/default', ChatDefaultRouter)

app.listen(PORT, async () => {
    await connectToDatabase()
    console.log(`Server listening in port: ${PORT}`)
})