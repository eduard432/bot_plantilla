import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import ChatBotRouter from './Router'
import { connectToDatabase } from './utils/mongodb'
dotenv.config()



const PORT = process.env.PORT || 3000
const app = express()

app.disable('x-powered-by')
app.use(express.json(), cors(), morgan('dev'))

app.use('/chatbot', ChatBotRouter)

app.listen(PORT, async () => {
    await connectToDatabase()
    console.log(`Server listening in port: ${PORT}`)
})