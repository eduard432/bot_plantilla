import { ChatGetInfo } from '@/types/Api'
import { redirect, notFound } from 'next/navigation'
import React from 'react'
import Chat from '../../../components/Chat'

interface ChatPageProps {
    params: {
        id: string
    }
}

const getChatInfo = async (id: string) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/info/${id}`)
        const data: ChatGetInfo = await response.json()
        return data
    }

export default async function ChatPage({params}: ChatPageProps) {

    const { id } = await params
    if(!id) return notFound();

    const chatInfo = await getChatInfo(id)
    

	return (<main className="p-4 px-12 h-screen">

        <>
            <h2 className="text-2xl font-semibold">
                Chateando con: {chatInfo.chatBot.name}
            </h2>
            <Chat messages={chatInfo.messages} id={id} />
        </>
</main>)
}
