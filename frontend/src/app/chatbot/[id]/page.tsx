'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ChatBotRecord } from '@/types/ChatBot'
import { FaArrowLeft } from 'react-icons/fa6'
import {
	Field,
	Fieldset,
	Input,
	Label,
	Legend,
	Select,
	Textarea,
} from '@headlessui/react'

export default function EditPage() {
	const params = useParams<{ id: string }>()
	const [chatBot, setChatBot] = useState<ChatBotRecord>()
	const router = useRouter()

	useEffect(() => {
		handleGetData()
	}, [])

	const handleGetData = async () => {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/chatbot/${params.id}`
		)
		if (response.ok) {
			const data: ChatBotRecord = await response.json()
			setChatBot(data)
		}
	}

	if (!params.id) {
		return router.replace('/')
	}

	return (
		<main className="p-4 px-12">
			<button onClick={() => router.push('/')}>
				<FaArrowLeft />
			</button>
			{chatBot && (
				<>
					<h2 className="text-2xl font-semibold">Editar a: "{chatBot.name}"</h2>
					<section className="w-1/2 mx-auto" >
						
						<form className="flex flex-col gap-y-2 my-4" >
							<div className="flex gap-2 items-center" >
								<label htmlFor="name">Nombre:</label>
								<input className="px-2 py-1 outline-none rounded border border-gray-300" name="name" type="text" />
							</div>
							<div className="flex gap-2 items-center" >
								<label htmlFor="model">Modelo:</label>
								<select name="model" className="px-2 py-1 outline-none rounded border border-gray-300">
									<option>gpt-3.5-turbo</option>
									<option>gpt4-turbo</option>
									<option>gpt-4</option>
									<option>gpt-4o</option>
								</select>
							</div>
							<div className="flex flex-col gap-2" >
								<label htmlFor="initial_prompt">Mensaje Inicial:</label>
								<textarea className="outline-none border border-gray-300 rounded px-2 py-1" rows={2} name="initial_prompt"></textarea>
							</div>
						</form>
						<div className="flex space-x-2" >
							<button
								className="rounded px-3 py-2 border border-gray-300"
								onClick={() => {}}>
								Descartar
							</button>
							<button
								className="rounded px-3 py-2 bg-black text-white"
								onClick={() => {}}>
								Guardar
							</button>
						</div>
					</section>
				</>
			)}
		</main>
	)
}
