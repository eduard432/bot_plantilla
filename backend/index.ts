import dotenv from 'dotenv'
import { connectToDatabase } from './utils/mongodb'
import app from './app'

dotenv.config()

const PORT = process.env.PORT || 3000

app.listen(PORT, async () => {
    await connectToDatabase()
    console.log(`Server listening in port: ${PORT}`)
})