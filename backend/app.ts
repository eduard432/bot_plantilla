import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import router from './routes'


const app = express()

app.disable('x-powered-by')
app.use(express.json(), cors(), morgan('dev'))

app.use(router)

export default app

