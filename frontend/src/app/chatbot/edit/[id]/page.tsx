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

type InputData = {
	name: string
	initialPrompt: string
}

export default function EditPage() {
	const params = useParams<{ id: string }>()
	const [chatBot, setChatBot] = useState<ChatBotRecord>()
	const [selectedConn, setSelectedConn] = useState<string>('')
	const [selectedFunc, setSelectedFunc] = useState<string>('')
	const [funcs, setFuncs] = useState<string[]>([])

	const router = useRouter()

	const handleGetFunctions = async () => {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chatbot/plugins`)
		if (response.ok) {
			const data: {plugins: string[]} = await response.json()
			setFuncs(data.plugins)
		}
	}

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
		handleGetFunctions()
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

	const handleAddFunction = async () => {
		if (!chatBot) return
		if (selectedFunc == '') return
		if (chatBot.tools.includes(selectedFunc)) return
		const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chatbot/plugins`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				botId: chatBot?._id,
				plugin: selectedFunc,
			}),
		})
		if (result.ok) {
			const newData = {
				...chatBot,
				tools: [...chatBot.tools, selectedFunc],
			}
			setChatBot(newData)
			setSelectedFunc('')
		}
	}

	const handleAddConnection = async () => {
		if (!chatBot) return
		if (selectedConn == '') return
		if (Object.keys(chatBot.connections).includes(selectedConn)) return
		const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chatbot/connection/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id: chatBot?._id,
				type: selectedConn,
			}),
		})
		if (result.ok) {
			const newData = {
				...chatBot,
				connections: {
					...chatBot.connections,
					[selectedConn]: {
						type: selectedConn,
						chatsId: [],
					},
				},
			}
			setChatBot(newData)
			setSelectedConn('')
		}
	}

	const handleRemoveConnection = async (type: string) => {
		if (!chatBot) return
		const body = JSON.stringify({
			id: chatBot._id,
			type,
		})
		console.log({ body })
		const result = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/chatbot/connection/delete`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body,
			}
		)

		if (result.ok) {
			// Eliminamos la propiedad del objeto en el state
			const { [type]: _, ...newConnections } = chatBot.connections

			const newData = {
				...chatBot,
				connections: newConnections,
			}
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
			router.push('/')
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
								onClick={() => router.push(`/chat/${chatBot.defaultChatId}`)}
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
						<h4 className="text-xl font-semibold my-2">Conexiones:</h4>
						<div className="my-4 flex">
							<select
								value={selectedConn}
								onChange={(event) => setSelectedConn(event.target.value)}
								className="px-2 py-1 border rounded border-gray-300"
								name="connectionType">
								<option value=""></option>
								<option value="wa">WhatsApp</option>
								<option value="disc">Discord</option>
							</select>
							<button
								onClick={() => handleAddConnection()}
								className="bg-black text-white px-3 py-1 text-sm rounded mx-2 flex items-center gap-1">
								<FaRegSquarePlus /> Agregar conexión
							</button>
						</div>
						<div className="divide-y border-y  border-gray-300 px-6">
							{Object.keys(chatBot.connections).map((type) => (
								<span
									key={type}
									className="flex items-center gap-2 justify-between py-2 group min-h-12">
									<p className="w-1/3">Cliente: {type}</p>
									<p className="w-1/3 text-start">
										Chats: {chatBot.connections[type].chatsId.length}
									</p>
									<div className="w-1/3 flex justify-end">
										<button
											onClick={() => handleRemoveConnection(type)}
											className="bg-gray-700 text-white rounded-md p-2 hidden group-hover:block">
											<FaRegTrashCan />
										</button>
									</div>
								</span>
							))}
						</div>
						<h4 className="text-xl font-semibold my-2">Funciones:</h4>
						<div className="my-4 flex">
							<select
								value={selectedFunc}
								onChange={(event) => setSelectedFunc(event.target.value)}
								className="px-2 py-1 border rounded border-gray-300"
								name="connectionType">
								<option value=""></option>
								{funcs.map((func) => (
									<option key={func} value={func}>
										{func}
									</option>
								))}
							</select>
							<button
								onClick={() => handleAddFunction()}
								className="bg-black text-white px-3 py-1 text-sm rounded mx-2 flex items-center gap-1">
								<FaRegSquarePlus /> Agregar funcion
							</button>
						</div>
						<div className="divide-y border-y  border-gray-300 px-6">
							{chatBot.tools.map((toolName) => (
								<span
									key={toolName}
									className="flex items-center gap-2 justify-between py-2 group min-h-12">
									<p className="w-1/3 capitalize">{toolName.replaceAll('_', ' ')}</p>
									<div className="w-1/3 flex justify-end">
										<button
											onClick={() => handleRemoveConnection(toolName)}
											className="bg-gray-700 text-white rounded-md p-2 hidden group-hover:block">
											<FaRegTrashCan />
										</button>
									</div>
								</span>
							))}
						</div>
					</section>
				</>
			)}
		</main>
	)
}
