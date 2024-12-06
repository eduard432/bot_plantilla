"use client"

import { ChatGetInfo } from "@/types/Api"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ChatPage () {
    const router = useRouter()

    const [chatInfo, setChatInfo] = useState<ChatGetInfo>()

    const params = useSearchParams()
    const id = params.get('id')

    if(!id) {
        return router.replace('/')
    }

    useEffect(() => {
        getChatInfo()
        return setChatInfo(undefined) 
    }, [id])
    

    const getChatInfo = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/info/${id}`)
        const data: ChatGetInfo = await response.json() 
        setChatInfo(data)
    }
    

    return (
        <main>
            {
                chatInfo && (<section>
                    <h2 className="text-2xl font-semibold" >Chateando con: {chatInfo.chatBot.name}</h2>
                    <p className="text-xl text-semibold" >Usa el model: {chatInfo.chatBot.model}</p>
                    <p>Messages:</p>
                    <ul>
                        {chatInfo.messages.map((message) => (<li>{message.role}:{message.content}</li>))}
                    </ul>
                </section>)
            }
        </main>
    )
    

}