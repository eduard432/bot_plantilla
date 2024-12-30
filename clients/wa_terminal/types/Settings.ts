import { ChatBot } from "./ChatBot";

export type ValidContacts = 'all' | string[]

export interface Settings {
    waSettings: {
        phoneNumber: string,
    }
    chatBot?: ChatBot,
    validContacts?: ValidContacts
}