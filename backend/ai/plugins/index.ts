import { ChatCompletionTool } from 'openai/resources';
import { getPrice, getPriceTool } from './getPrice'

export const aiPlugins: {
	[key: string]: { func: Function; schema: ChatCompletionTool }
} = {
	'get_price': { func: getPrice, schema: getPriceTool },
}
