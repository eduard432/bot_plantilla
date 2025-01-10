import { ChatBotRecord } from '@/types/ChatBot'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { FaRegSquarePlus, FaRegTrashCan } from 'react-icons/fa6'

type ConnectionsPageParams = {
	chatBot: ChatBotRecord
	setChatBot: Dispatch<SetStateAction<ChatBotRecord | undefined>>
}

const Functions = ({ chatBot, setChatBot }: ConnectionsPageParams) => {
	

	const [funcs, setFuncs] = useState<string[]>([])
	const [selectedFunc, setSelectedFunc] = useState<string>('')

	const handleGetFunctions = async () => {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chatbot/plugins`)
		if (response.ok) {
			const data: { plugins: string[] } = await response.json()
			setFuncs(data.plugins)
		}
	}

    const handleDeleteFunction = async (func: string) => {
        if (!chatBot) return
        const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chatbot/plugins`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                botId: chatBot?._id,
                plugin: func,
            }),
        })
        if (result.ok) {
            const newData = {
                ...chatBot,
                tools: chatBot.tools.filter((tool) => tool !== func),
            }
            setChatBot(newData)
        }
    }

    useEffect(() => {
		handleGetFunctions()
	}, [])

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

	return (
		<>
			<h4 className="text-xl font-semibold my-2">Funciones:</h4>
			<div className="my-4 flex">
				<select
					value={selectedFunc}
					onChange={(event) => setSelectedFunc(event.target.value)}
					className="px-2 py-1 border rounded border-gray-300 min-w-40 capitalize"
					name="connectionType">
					<option value=""></option>
					{funcs.filter((func) => !chatBot.tools.includes(func)).map((func) => (
						<option className="capitalize" key={func} value={func}>
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
								onClick={() => handleDeleteFunction(toolName)}
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

export default Functions
