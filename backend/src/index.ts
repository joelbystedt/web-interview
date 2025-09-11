import express, { Request, Response } from 'express'
import cors from 'cors'
import { TodoListStore } from './TodoListStore.js'
import { CONFIG } from './config.js'
import todoListRoutes from './routes/todoLists.js'

const app = express()

app.use(cors())
app.use(express.json())

const PORT = 3001

export const todoListStore = new TodoListStore()

app.get('/', (_req: Request, res: Response) => res.send(CONFIG.MESSAGES.HELLO_WORLD))

app.use('/api/lists', todoListRoutes)

app.listen(PORT, () => console.log(`${CONFIG.MESSAGES.SERVER_LISTENING} ${PORT}!`))
