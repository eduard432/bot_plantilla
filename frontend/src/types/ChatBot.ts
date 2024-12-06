export interface ChatBot {
    name: string
    model: string
    initialPrompt: string
    defaultChatId: string
}

export interface ChatBotRecord extends ChatBot {
    _id: string;
  }