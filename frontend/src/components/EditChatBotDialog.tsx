import {
	Description,
	Dialog,
	DialogPanel,
	DialogTitle,
	Field,
	Fieldset,
	Input,
	Label,
	Select,
	Textarea,
} from '@headlessui/react'
import React, { Dispatch, FC, SetStateAction, useState } from 'react'
import { ChatBot, ChatBotRecord } from '@/types/ChatBot'

const defaultChatBot: ChatBot = {
	initialPrompt:
		'Eres una asistente en español que ayuda a resolver las dudas de las personas por un sistema de mensajería',
	model: 'gpt-4o',
	name: 'Compa 1',
}

const EditChatBotDialog: FC<{
	isOpen: boolean
	setIsOpen: Dispatch<SetStateAction<boolean>>
	setData: Dispatch<SetStateAction<ChatBotRecord[]>>
}> = ({ isOpen, setIsOpen, setData }) => {
	const [chatBot, setChatBot] = useState<ChatBot>(defaultChatBot)

	const handleSaveData = async () => {
		console.log({ chatBot })
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chatbot`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(chatBot),
		})
		if (response.ok) {
			const data: { msg: string; id: string } = await response.json()
			setData((rest) => [...rest, { ...chatBot, _id: data.id }])
		}
        setIsOpen(false)
	}

	return (
		<Dialog
			open={isOpen}
			onClose={() => setIsOpen(false)}
			className="relative z-50"
		>
			<div className="fixed inset-0 flex w-screen items-center justify-center p-4">
				<DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
					<DialogTitle className="font-bold">Crear nuevo ChatBot</DialogTitle>
					<Description>Crea tu nuevo ChatBot personalizable.</Description>
					<Fieldset className="space-y-4">
						<Field>
							<Label>Nombre:</Label>
							<Input
								value={chatBot.name}
								onChange={(event) => {
									setChatBot((chatBot) => ({
										...chatBot,
										name: event.target.value,
									}))
								}}
								className="mx-2 border border-gray-300 rounded px-2 py-1"
								name="name"
							/>
						</Field>
						<Field>
							<Label className="">Modelo:</Label>
							<Select
								value={chatBot.model}
								onChange={(event) => {
									setChatBot((chatBot) => ({
										...chatBot,
										model: event.target.value,
									}))
								}}
								className="border border-gray-300 rounded px-2 py-1 mx-2"
								name="model"
							>
								<option>gpt-4o</option>
								<option>gpt-4o-mini</option>
								<option>gp4-3.5 Turbo</option>
							</Select>
						</Field>
						<Field>
							<Label className="block">Initial Prompt:</Label>
							<Textarea
								value={chatBot.initialPrompt}
								onChange={(event) => {
									setChatBot((chatBot) => ({
										...chatBot,
										initialPrompt: event.target.value,
									}))
								}}
								rows={4}
								className="resize-x mt-1 border border-gray-300 rounded px-2 py-1 w-full"
								name="initialPrompt"
							/>
						</Field>
					</Fieldset>
					<div className="flex justify-end gap-4">
						<button
							className="rounded px-3 py-2 border border-gray-300"
							onClick={() => {
								setIsOpen(false)
								setChatBot(defaultChatBot)
							}}
						>
							Cancelar
						</button>
						<button
							className="rounded px-3 py-2 bg-black text-white"
							onClick={() => handleSaveData()}
						>
							Guardar
						</button>
					</div>
				</DialogPanel>
			</div>
		</Dialog>
	)
}

export default EditChatBotDialog
