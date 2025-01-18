'use client'

import { Message } from 'ai'
import { useChat } from 'ai/react'
import React, { Dispatch, KeyboardEventHandler, SetStateAction, useEffect } from 'react'
import { FaPaperPlane } from 'react-icons/fa6'
import ReactMarkdown from 'react-markdown'

interface ChatProps {
	messages: Message[]
	id: string
	clean?: boolean
	setClean?: Dispatch<SetStateAction<boolean>>
}

const Chat = ({ messages: initialMessages, id, clean, setClean }: ChatProps) => {
	const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } =
		useChat({
			api: `${process.env.NEXT_PUBLIC_API_URL}/chat/${id}`,
			initialMessages: initialMessages,
			body: { id, stream: true, allMessages: true },
		})

	const clearMessages = () => {
		if (setClean) {
			setMessages([])
			setClean(false)
		}
	}

	useEffect(() => {
		if (clean) clearMessages()
	}, [clean])

	const handleSubmitKey: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
		// Verifica si se presionaron Enter + Alt
		if (event.key === 'Enter' && event.altKey) {
			event.preventDefault() // Evita que se inserte una nueva línea en el textarea
			handleSubmit()
		}
	}

	return (
		<section className="rounded border h-full md:h-5/6 border-gray-300 p-4 w-full md:w-2/3 mx-auto flex flex-col justify-between gap-4 my-2">
			<ul className="overflow-y-auto  px-4">
				{messages.map((message, i) => {
					if (
						message.role === 'user' ||
						(message.role === 'assistant' && message.content)
					) {
						return (
							<li
								key={i}
								className={`my-6 flex ${
									message.role == 'user' ? 'justify-end' : 'justify-start'
								}`}>
								<ReactMarkdown
									className={`py-2 px-3 inline-block max-w-prose ${
										message.role == 'user'
											? 'bg-gray-200 rounded-3xl rounded-br-none'
											: 'bg-slate-300 text-gray-900 rounded-xl rounded-bl-none'
									}`}>
									{message.content}
								</ReactMarkdown>
							</li>
						)
					} else {
						return (
							<li key={i} className={`my-6 flex justify-start`}>
								<p className="py-2 px-3 inline-block max-w-prose bg-slate-800 text-gray-50 rounded-xl rounded-bl-none">
									Obteniendo Informacion...
								</p>
							</li>
						)
					}
				})}
			</ul>
			<form
				onSubmit={handleSubmit}
				className="rounded border border-gray-300 w-full flex">
				<textarea
					disabled={isLoading}
					value={input}
					onChange={handleInputChange}
					placeholder="Escribe algo..."
					className="w-full py-2 px-4 outline-none rounded"
					onKeyDown={handleSubmitKey}
					rows={2}
				/>
				<button disabled={isLoading} type="submit" className="px-4">
					<FaPaperPlane />
				</button>
			</form>
		</section>
	)
}

export default Chat
