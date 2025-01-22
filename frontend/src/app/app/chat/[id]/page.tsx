'use client'

import { ChatGetInfo } from '@/types/Api'
import { useParams, useRouter } from 'next/navigation'
import { KeyboardEventHandler, useEffect, useState } from 'react'
import { FaPaperPlane, FaPencil, FaTrash } from 'react-icons/fa6'
import { useChat } from 'ai/react'
import ForwardButton from '@/components/ForwardButton'
import Chat from '@/components/Chat'

export default function ChatPage() {
	const [chatInfo, setChatInfo] = useState<ChatGetInfo>()
	const [clean, setClean] = useState<boolean>(false)
	const { id } = useParams<{ id: string }>()

	const router = useRouter()

	useEffect(() => {
		getChatInfo()
		return setChatInfo(undefined)
	}, [id])


	const getChatInfo = async () => {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/info/${id}`)
		const data: ChatGetInfo = await response.json()
		setChatInfo(data)
	}


	const handleDeleteAllMessages = async () => {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/default_chat/messages/${id}`, {
			method: 'DELETE'
		})
		if (response.ok) {
			setClean(true)
		}
	}

	return (
		<main className="p-4 px-12 h-screen">
			<ForwardButton />
			{chatInfo && (
				<>
					<h2 className="text-2xl font-semibold">
						Chateando con: {chatInfo.chatBot.name}
					</h2>
					<p className="text-xl text-semibold">Usa el model: {chatInfo.chatBot.model}</p>
					<section className="w-2/3 mx-auto my-4 flex justify-end" >
						<div className="flex gap-1">
							<button
								onClick={() => router.push(`/app/chatbot/edit/${chatInfo.chatBot._id}`)}
								className="px-2 border border-gray-300 rounded text-sm flex gap-1 items-center">
								<FaPencil /> Editar ChatBot
							</button>
							<button
								onClick={() => handleDeleteAllMessages()}
								className="px-2 border border-gray-300 rounded text-sm flex gap-1 items-center">
								<FaTrash /> Eliminar Mensajes
							</button>
						</div>
					</section>
					<Chat id={id} messages={chatInfo.messages} clean={clean} setClean={setClean} />
				</>
			)}
		</main>
	)
}
