import express, { Request, Response } from 'express'
import cors from 'cors'
import { TodoStore } from './TodoStore'

const app = express()

app.use(cors())
app.use(express.json())

const PORT = 3001

export const todoStore = new TodoStore()

app.get('/', (_req: Request, res: Response) => res.send('Hello World!'))

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
