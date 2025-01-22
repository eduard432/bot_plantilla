import { CoreTool } from "ai";
import { newGetPriceTool } from "./getPrice";
import { getProductsTool } from "./getProducts/getProducts";
import { getProductTool } from "./getProducts/getProduct";

export const aiPlugins: {[key: string]: CoreTool} = {
    'get_products': getProductsTool,
    'get_product': getProductTool
}