import { ChatBotRecord } from '@/types/ChatBot'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { FaRegSquarePlus, FaRegTrashCan } from 'react-icons/fa6'

type ConnectionsPageParams = {
    chatBot: ChatBotRecord
    setChatBot: Dispatch<SetStateAction<ChatBotRecord | undefined>>
}

const Connections = ({
	chatBot,
    setChatBot
}: ConnectionsPageParams) => {
	const [selectedConn, setSelectedConn] = useState<string>('')

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

	return (
		<>
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
		</>
	)
}

export default Connections
