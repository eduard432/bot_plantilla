import dotenv from 'dotenv'

dotenv.config()

export const ENV = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    FRONTEND_URL: process.env.FRONTEND_URL
}