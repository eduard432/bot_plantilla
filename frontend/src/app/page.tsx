"use client";

import { useState, useEffect } from "react";
import { ChatBotRecord } from "@/types/ChatBot";
import { FaRegSquarePlus, FaRegTrashCan, FaPencil, FaRegMessage } from "react-icons/fa6";
import { useRouter } from 'next/navigation'
import EditChatBotDialog from "@/components/EditChatBotDialog";

export default function Home() {
  const [data, setData] = useState<ChatBotRecord[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter()

  useEffect(() => {
    handleGetData();
  }, []);

  const handleGetData = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chatbot/all`);
    if (response.ok) {
      const data: ChatBotRecord[] = await response.json();
      console.log({data})
      setData(data);
    }
  };


  const handleDeleteData = async (id: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chatbot/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setData((data) => {
        const newData = [...data];
        const index = newData.findIndex((chatbot) => chatbot._id == id);
        if (index > -1) {
          newData.splice(index, 1);
        }
        return newData;
      });
    }
  };

  const handleChat = async (id:string, defaultChatId: string | undefined) => {
    if(defaultChatId) {
      router.push(`/chat?id=${defaultChatId}`)
    } else {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/add/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({isDefault: true}),
      })
      if(response.ok) {
        const data: {msg: string, chatId: string} = await response.json()
        router.push(`/chat?id=${data.chatId}`)
      }
    }
  }

  return (
    <>
      <main className="p-4 px-12">
        <section className="my-4">
          <button
            onClick={() =>
              setIsOpen(true)
            }
            className="bg-black text-white rounded-md px-4 py-2"
          >
            <FaRegSquarePlus />
          </button>
        </section>
        <section className="flex gap-4">
          {data.map(({ model, name, _id, defaultChatId }, i) => (
            <div key={i} className="p-2 border rounded border-gray-300 min-w-48">
              <h2 className="text-xl font-semibold">{name}</h2>
              <p>Model: {model}</p>
              <div className="mt-2 flex space-x-2" >
                <button className="text-sm bg-black text-white rounded p-2" onClick={() => router.push(`/chatbot/${_id}`)}>
                  <FaPencil />
                </button>
                <button className="text-sm bg-black text-white rounded p-2" onClick={() => handleDeleteData(_id)}>
                  <FaRegTrashCan />
                </button>
                <button className="text-sm bg-black text-white rounded p-2" onClick={() => handleChat(_id, defaultChatId)}>
                  <FaRegMessage />
                </button>
              </div>
            </div>
          ))}
        </section>
      </main>
      <EditChatBotDialog isOpen={isOpen} setIsOpen={setIsOpen} setData={setData} />
    </>
  );
}
