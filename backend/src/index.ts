import express, { Request, Response } from 'express'
import cors from 'cors'
import { TodoStore } from './TodoStore.js'
import { CONFIG } from './config.js'
import todoRoutes from './routes.js'

const app = express()

app.use(cors())
app.use(express.json())

const PORT = 3001

export const todoStore = new TodoStore()

app.get('/', (_req: Request, res: Response) => res.send(CONFIG.MESSAGES.HELLO_WORLD))

app.use('/api/todos', todoRoutes)

app.listen(PORT, () => console.log(`${CONFIG.MESSAGES.SERVER_LISTENING} ${PORT}!`))
