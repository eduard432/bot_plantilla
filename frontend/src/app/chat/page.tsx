"use client";

import { ChatGetInfo } from "@/types/Api";
import { useSearchParams, useRouter } from "next/navigation";
import { FormEventHandler, KeyboardEventHandler, useEffect, useState } from "react";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa6";
import { useChat } from 'ai/react';


export default function ChatPage() {
  const router = useRouter();

  
  const [chatInfo, setChatInfo] = useState<ChatGetInfo>();
  const [message, setMessage] = useState("");
  
  const params = useSearchParams();
  const id = params.get("id");
  
  if (!id) {
    return router.replace("/");
  }

  const {messages, input, handleInputChange, handleSubmit: hS} = useChat()

  useEffect(() => {
    getChatInfo();
    return setChatInfo(undefined);
  }, [id]);

  const getChatInfo = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/chat/info/${id}`
    );
    const data: ChatGetInfo = await response.json();
    setChatInfo(data);
  };

  const handleSubmitKey: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    // Verifica si se presionaron Enter + Alt
    if (event.key === "Enter" && event.altKey) {
      event.preventDefault(); // Evita que se inserte una nueva línea en el textarea
      handleSendMsg();
    }
  };

  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();
	handleSendMsg()
  };

  const handleSendMsg = () => {
	console.log(message)
	setMessage('')
  };

  return (
    <main className="p-4 px-12">
      <button onClick={() => router.push("/")}>
        <FaArrowLeft />
      </button>
      {chatInfo && (
        <>
          <h2 className="text-2xl font-semibold">
            Chateando con: {chatInfo.chatBot.name}
          </h2>
          <p className="text-xl text-semibold">
            Usa el model: {chatInfo.chatBot.model}
          </p>
          <section className="rounded border border-gray-300 p-4 w-2/3 mx-auto h-full flex flex-col justify-between">
            <ul className="overflow-auto px-4 h-full">
              {chatInfo.messages.map((message, i) => (
                <li
                  key={i}
                  className={`my-6 flex ${
                    message.role == "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <p
                    className={`p-2 inline-block max-w-prose ${
                      message.role == "user"
                        ? "bg-gray-200 rounded-xl rounded-br-none"
                        : "bg-slate-300 text-gray-900 rounded-xl rounded-bl-none"
                    }`}
                  >
                    {message.content}
                  </p>
                </li>
              ))}
            </ul>
            <form
              onSubmit={handleSubmit}
              className="rounded border border-gray-300 w-full flex"
            >
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Escribe algo..."
                className="w-full py-2 px-4 outline-none"
			  	onKeyDown={handleSubmitKey}
              />
              <button type="submit" className="px-4">
                <FaPaperPlane />
              </button>
            </form>
          </section>
        </>
      )}
    </main>
  );
}
