import WAWebJS from "whatsapp-web.js";
import chalk from 'chalk'


export const messageHandler = async (message: WAWebJS.Message) => {
    const phone = message.from
    console.log(chalk.magenta(`[CLIENT]: New message: ${message.id.id} - from - ${phone}`))

    
}