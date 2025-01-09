import { OpenAI } from 'openai'
import { ENV } from '../env'


export const openai = new OpenAI({
	apiKey: ENV.OPENAI_API_KEY,
})