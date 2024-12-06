export interface ChatBot {
    name: string
    model: string
    initialPrompt: string
}

export interface ChatBotRecord extends ChatBot {
    _id: string;
  }