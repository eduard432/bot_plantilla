import { CoreTool } from "ai";
import { newGetPriceTool } from "./getPrice";
import { getProductsTool } from "./getProduts/getProducts";

export const aiPlugins: {[key: string]: CoreTool} = {
    'get_products': getProductsTool
}