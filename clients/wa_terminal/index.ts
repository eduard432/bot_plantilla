import { Client, LocalAuth } from 'whatsapp-web.js'
import qrcode from 'qrcode-terminal'


const client = new Client({
    puppeteer: {
        args: ['--no-sandbox']
    },
    authStrategy: new LocalAuth({
        dataPath: './auth_session'
    })
})

client.once('ready', () => {
    console.log('Client is ready!!')
})

client.once('disconnected', () => {
    console.log('Client offline!!')
})

client.on('qr', (qrString) => {
    console.log('QR READY!!')
    qrcode.generate(qrString)
})