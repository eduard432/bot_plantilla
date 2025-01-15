import { tool } from "ai";
import { z } from "zod";
import { Articles, Item } from "./types";

const getItemsApi = async (): Promise<Item[]> => {
    const resp = await fetch('https://www.dragoorum.com/desarrollo/productos.php')
    const text = (await resp.text()).split('<body>')[1].split('</body>')[0]
    const data: Articles = JSON.parse(text)
    return data.items
}

const getProducts = async () => {
    const items = await getItemsApi()
    const products: {price: number, name: string}[] = []

    let productStr = ''

    for (let i = 0; i < items.length; i++) {
        const product = items[i];
        if(product.can_be_sold) {
            products.push({price: product.rate, name: product.description})
            productStr += `${product.description} - $${product.rate}\n`
        }
    }

    return productStr
}

export const getProductsTool = tool({
    description: 'Obtener productos de la Tienda',
    parameters: z.object({}),
    execute: getProducts,
})