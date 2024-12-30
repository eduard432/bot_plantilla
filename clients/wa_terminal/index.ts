import { Client, LocalAuth } from 'whatsapp-web.js'
import qrcode from 'qrcode-terminal'
import dotenv from 'dotenv'
import { setupSettings, defaultMenu, saveInitialSettings } from './menus'

dotenv.config()

const client = new Client({
    authStrategy: new LocalAuth()
})

client.once('ready', async () => {
    await saveInitialSettings(client)
    console.clear()
    console.log('Client is ready!!')
    await setupSettings(client)
})

client.once('disconnected', () => {
    console.log('Client offline!!')
})

client.on('qr', (qrString) => {
    console.log('QR READY!!')
    qrcode.generate(qrString, {small: true})
})

defaultMenu(client)