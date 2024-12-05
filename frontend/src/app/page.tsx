"use client";

import { useState, useEffect } from "react";

import { ChatBot } from "../../../types/ChatBot";
import { FaRegSquarePlus, FaRegTrashCan, FaPencil } from "react-icons/fa6";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

interface ChatBotRecord extends ChatBot {
  _id: string;
}

export default function Home() {
  const [data, setData] = useState<ChatBotRecord[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    handleGetData();
  }, []);

  const handleGetData = async () => {
    const response = await fetch("http://localhost:3000/chatbot/all");
    if (response.ok) {
      console.log("ok");
      const data: ChatBotRecord[] = await response.json();
      console.log(data);
      setData(data);
    }
  };

  const handleCreateData = async ({ model, name }: ChatBot) => {
    const response = await fetch("http://localhost:3000/chatbot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model, name }),
    });
    if (response.ok) {
      const data: { msg: string; id: string } = await response.json();
      setData((rest) => [...rest, { model, name, _id: data.id }]);
    }
  };

  const deleteData = async (id: string) => {
    const response = await fetch("http://localhost:3000/chatbot/" + id, {
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

  return (
    <>
      <main className="p-4 px-12">
        <section className="my-4">
          <button
            onClick={() =>
              handleCreateData({ model: "prueba", name: "test-1" })
            }
            className="bg-black text-white rounded-md px-4 py-2"
          >
            <FaRegSquarePlus />
          </button>
        </section>
        <section className="flex gap-4">
          {data.map(({ model, name, _id }, i) => (
            <div key={i} className="p-2 border rounded border-gray-300">
              <h2 className="text-xl font-semibold">{name}</h2>
              <p>Model: {model}</p>
              <button className="text-sm" onClick={() => deleteData(_id)}>
                <FaRegTrashCan />
              </button>
              <button className="text-sm" onClick={() => setIsOpen(true)}>
                <FaPencil />
              </button>
            </div>
          ))}
        </section>
      </main>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
            <DialogTitle className="font-bold">Editar Chatbot</DialogTitle>
            <Description>
              Edita todas las caracteríitcas de tu chatbot
            </Description>
            <p>
              Are you sure you want to deactivate your account? All of your data
              will be permanently removed.
            </p>
            <div className="flex justify-end gap-4">
              <button className="bg-black text-white rounded-md px-4 py-2" onClick={() => setIsOpen(false)}>Cerrar</button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
