import { MessageRecord } from "./Chat";
import { ChatBotRecord } from "./ChatBot";
import { CoreMessage, Message } from 'ai'

export interface ChatGetInfo {
    chatBot: ChatBotRecord
    messages: Message[]
}