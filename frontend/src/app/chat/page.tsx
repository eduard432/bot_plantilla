'use client'

import { ChatGetInfo } from '@/types/Api'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa6'

export default function ChatPage() {
	const router = useRouter()

	const [chatInfo, setChatInfo] = useState<ChatGetInfo>()

	const params = useSearchParams()
	const id = params.get('id')

	if (!id) {
		return router.replace('/')
	}

	useEffect(() => {
		getChatInfo()
		return setChatInfo(undefined)
	}, [id])

	const getChatInfo = async () => {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/chat/info/${id}`
		)
		const data: ChatGetInfo = await response.json()
		setChatInfo(data)
	}

	return (
		<main className="p-4 px-12">
			<button onClick={() => router.push('/')}>
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
					<section className="rounded border border-gray-300 p-4 w-2/3 mx-auto h-full flex flex-col justify-between" >
						<ul className="overflow-auto px-4 h-full">
							{chatInfo.messages.map((message, i) => (
								<li
									key={i}
									className={`my-6 flex ${
										message.role == 'user' ? 'justify-end' : 'justify-start'
									}`}
								>
									<p
										className={`p-2 inline-block max-w-prose ${
											message.role == 'user' ? 'bg-gray-200 rounded-xl rounded-br-none' : 'bg-slate-300 text-gray-900 rounded-xl rounded-bl-none'
										}`}
									>
										{message.content}
									</p>
								</li>
							))}
						</ul>
                        <input placeholder="Escribe algo..." className="rounded border border-gray-300  w-full px-4 py-2" type="text" />
					</section>
				</>
			)}
		</main>
	)
}
