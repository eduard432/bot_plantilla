import { Message } from "./Chat";
import { ChatBot } from "./ChatBot";

export interface ChatGetInfo {
    chatBot: ChatBot
    messages: Message[]
}