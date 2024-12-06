'use client'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ChatBotRecord } from '../../../../../types/ChatBot'
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
		handleGetData(params.id)
	}, [])

	const handleGetData = async (id: string) => {
		const response = await fetch(`http://localhost:3000/chatbot/${params.id}`)
		if (response.ok) {
			const data: ChatBotRecord = await response.json()
			setChatBot(data)
		}
	}

	return (
		<main className="p-4 px-12">
			<button onClick={() => router.push('/')}>
				<FaArrowLeft />
			</button>
			{chatBot && (
				<Fieldset className="space-y-8 rounded border border-gray-300 p-2">
					<Legend className="text-lg font-bold">Configuración del chatbot:</Legend>
					<Field>
						<Label>Nombre:</Label>
						<Input defaultValue={chatBot.name} className="mx-2 border border-gray-300 rounded px-2 py-1" name="name" />
					</Field>
					<Field>
						<Label className="">Modelo:</Label>
						<Select className="mt-1 border border-gray-300 rounded px-2 py-1 mx-2" name="country">
							<option>gpt-4o</option>
							<option>gpt-4o-mini</option>
							<option>gp4-3.5 Turbo</option>
						</Select>
					</Field>
					<Field>
						<Label className="block">Delivery notes</Label>
						<Textarea className="mt-1 block" name="notes" />
					</Field>
				</Fieldset>
			)}
		</main>
	)
}
