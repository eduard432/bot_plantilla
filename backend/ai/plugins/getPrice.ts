import { ChatCompletionTool } from 'openai/resources'
import { openai } from '../openai'
import { tool } from 'ai'
import { z } from 'zod'

const getPriceTool: ChatCompletionTool = {
	type: 'function',
	function: {
		name: 'get_price',
		description: 'Obtiene el precio de un producto.',
		parameters: {
			type: 'object',
			properties: {
				productName: {
					type: 'string',
					description: 'El nombre del producto del que obtener el precio.',
				},
			},
			required: ['productName'],
			additionalProperties: false,
		},
	},
}

export const newGetPriceTool = tool({
	description: 'Obtiene el precio de un producto.',
	parameters: z.object({
		productName: z.string({
			description: 'El nombre del producto del que obtener el precio.',
		}),
	}),
	execute: async ({ productName }) => {
		return getPrice(productName)
	},
})

const getPrice = async (productName: string) => {
	const legoPricesString = `Bloque básico 2x4 (rojo): $0.25
        Placa 4x4 (azul): $0.50
        Rueda pequeña (con neumático): $1.00
        Figura de minifigura estándar: $3.50
        Ventana con marco: $1.25
        Puerta con bisagra: $2.00
        Baseplate 32x32 (verde): $8.00
        Eje técnico (15M): $0.75
        Engranaje pequeño: $0.40
        Ladrillo transparente (1x2): $0.30`

	const completion = await openai.chat.completions.create({
		model: 'gpt-3.5-turbo',
		messages: [
			{
				role: 'system',
				content: `Eres una ia que proporciona el precio de distintos productos, el usuario te da el nombre de un producto y tu le das el precio.
                Si no sabes el precio de un producto, puedes decir "No se el precio de ese producto".
                Lista de productos:
                ${legoPricesString}
                `,
			},
			{
				role: 'user',
				content: productName,
			},
		],
	})

	if (completion) {
		return completion.choices[0].message.content
	} else {
		return 'No se el precio de ese producto'
	}
}

export { getPrice, getPriceTool }
