export interface ChatBot {
    name: string
    model: string
}

export interface ChatBotRecord extends ChatBot {
    _id: string;
  }