import { Client, LocalAuth } from 'whatsapp-web.js'
import qrcode from 'qrcode-terminal'
import dotenv from 'dotenv'
import { messageHandler } from './handlers/messasgeHandler'

dotenv.config()

const client = new Client({
    authStrategy: new LocalAuth()
})

client.once('ready', async () => {
    console.clear()
    console.log('Client is ready!!')

})

client.once('disconnected', () => {
    console.log('Client offline!!')
})

client.on('qr', (qrString) => {
    console.log('QR READY!!')
    qrcode.generate(qrString, {small: true})
})

client.on('message', messageHandler)

// Start the client
client.initialize()