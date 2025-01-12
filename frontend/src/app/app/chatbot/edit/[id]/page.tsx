'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ChatBotRecord } from '@/types/ChatBot'

import {
	FaRegTrashCan,
	FaRegMessage,
	FaRegSquarePlus,
	FaCopy,
	FaTrash,
} from 'react-icons/fa6'
import { useForm, SubmitHandler } from 'react-hook-form'
import ForwardButton from '@/components/ForwardButton'
import Connections from './Connections'
import Functions from './Functions'

type InputData = {
	name: string
	initialPrompt: string
}

export default function EditPage() {
	const params = useParams<{ id: string }>()
	const [chatBot, setChatBot] = useState<ChatBotRecord>()
	
	const router = useRouter()

	const handleGetData = async () => {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/chatbot/${params.id}`
		)
		if (response.ok) {
			const data: ChatBotRecord = await response.json()
			setChatBot(data)
		}
	}

	useEffect(() => {
		handleGetData()
	}, [])

	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
	} = useForm<InputData>({
		defaultValues: {
			initialPrompt: '',
			name: '',
		},
		values: {
			name: chatBot?.name || '',
			initialPrompt: chatBot?.initialPrompt || '',
		},
		mode: 'onBlur',
	})

	const currentValues = watch()

	const hasChanges =
		JSON.stringify({ name: chatBot?.name, initialPrompt: chatBot?.initialPrompt }) ==
		JSON.stringify(currentValues)

	const onSubmit: SubmitHandler<InputData> = async (inputData) => {
		const result = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/chatbot/${chatBot?._id}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(inputData),
			}
		)
		if (result.ok && chatBot) {
			const { initialPrompt, name } = inputData
			const newData = { ...chatBot, initialPrompt, name }
			setChatBot(newData)
		}
	}

	

	

	const handleDeleteData = async () => {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/chatbot/${chatBot?._id}`,
			{
				method: 'DELETE',
			}
		)
		if (response.ok) {
			router.push('/app')
		}
	}

	return (
		<main className="p-4 px-12">
			<ForwardButton />
			{chatBot && (
				<>
					<h2 className="text-2xl font-semibold">Editar a: "{chatBot.name}"</h2>
					<section className="w-1/2 mx-auto">
						<div className="flex gap-1">
							<button
								onClick={() => navigator.clipboard.writeText(chatBot._id)}
								className="px-2 border border-gray-300 rounded text-sm flex gap-1 items-center">
								<FaCopy /> Copiar Id
							</button>
							<button
								onClick={() => router.push(`/app/chat/${chatBot.defaultChatId}`)}
								className="px-2 border border-gray-300 rounded text-sm flex gap-1 items-center">
								<FaRegMessage /> Chat
							</button>
							<button
								onClick={() => handleDeleteData()}
								className="px-2 border border-gray-300 rounded text-sm flex gap-1 items-center">
								<FaTrash /> Eliminar
							</button>
						</div>
						<form
							onSubmit={handleSubmit(onSubmit)}
							className="flex flex-col gap-y-2 my-4">
							<h4 className="text-xl font-semibold">Datos:</h4>
							<div className="flex gap-2 items-center">
								<label htmlFor="name">Nombre:</label>
								<input
									{...register('name', {
										required: {
											message: 'Este campo es requerido',
											value: true,
										},
									})}
									className="px-2 py-1 outline-none rounded border border-gray-300"
									name="name"
									type="text"
								/>
								{errors.name && <p className="text-red-700">{errors.name.message}</p>}
							</div>
							<div className="flex gap-2 items-center">
								<label htmlFor="model">Modelo:</label>
								<select
									disabled
									value={chatBot.model}
									className="px-2 py-1 border rounded border-gray-300"
									name="model">
									<option>gpt-3.5-turbo</option>
									<option>gpt4-turbo</option>
									<option>gpt-4</option>
									<option>gpt-4o</option>
								</select>
							</div>
							<div className="flex flex-col gap-2">
								<label htmlFor="initialPrompt">Mensaje Inicial:</label>
								<textarea
									{...register('initialPrompt', { required: true })}
									className="outline-none border border-gray-300 rounded px-2 py-1"
									rows={2}
									name="initialPrompt"></textarea>
							</div>

							<div className="flex space-x-2">
								<button
									disabled={hasChanges}
									type="button"
									className="rounded px-2 py-1 border border-gray-300 disabled:opacity-60 text-sm"
									onClick={() => reset()}>
									Descartar
								</button>
								<button
									disabled={hasChanges}
									type="submit"
									className="rounded px-2 py-1 bg-black text-white disabled:opacity-60 text-sm">
									Guardar
								</button>
							</div>
						</form>
						<hr />
						<Connections chatBot={chatBot} setChatBot={setChatBot} />
						<Functions chatBot={chatBot} setChatBot={setChatBot} />
					</section>
				</>
			)}
		</main>
	)
}
