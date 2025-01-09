import { ChatCompletionTool } from "openai/resources"

const getPriceTool: ChatCompletionTool = {
    type: "function",
    function: {
        name: "get_price",
        description: "Obtiene el precio de un producto.",
        parameters: {
            type: "object",
            properties: {
                productName: {
                    type: "string",
                    description: "El nombre del producto del que obtener el precio.",
                }
            },
            required: ["productName"],
            additionalProperties: false,
        }
    },
}

async function getPrice (productName: string) {
    return "$100"
}

export {
    getPrice,
    getPriceTool
}