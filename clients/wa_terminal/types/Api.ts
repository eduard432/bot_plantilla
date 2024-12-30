import { MessageRecord } from "./Chat";
import { ChatBotRecord } from "./ChatBot";

export interface ChatGetInfo {
    chatBot: ChatBotRecord
    messages: MessageRecord[]
}