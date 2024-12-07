import { Message } from "../types/Chat";

export const testMessages: Message[] = [
    {
      role: "user",
      content: "Hola, ¿cómo estás?",
    },
    {
      role: "assistant",
      content: "¡Hola! Estoy aquí para ayudarte, ¿en qué puedo asistirte hoy?",
    },
    {
      role: "user",
      content: "¿Cuál es el clima en mi ciudad?",
    },
    {
      role: "assistant",
      content: "Lo siento, necesitaría saber tu ubicación para decirte el clima.",
    },
    {
      role: "user",
      content: "Quiero aprender sobre MongoDB. ¿Por dónde empiezo?",
    },
    {
      role: "assistant",
      content: "Te recomiendo empezar por la documentación oficial de MongoDB. También puedo explicarte los conceptos básicos si lo deseas.",
    },]