import express, { Request, Response } from 'express'
import cors from 'cors'

interface Todo {
  id: string
  text: string
  completed: boolean
  listId: string
  createdAt: Date
  updatedAt: Date
  dueDate?: Date
}

interface TodoList {
  id: string
  name: string
}

const app = express()

app.use(cors())
app.use(express.json())

const PORT = 3001

const todos = new Map<string, Todo>()
const todoLists = new Map<string, TodoList>()

todoLists.set('default', { id: 'default', name: 'Default List' })

function createTodo(text: string, listId: string = 'default'): Todo {
  const id = crypto.randomUUID()
  const todo: Todo = {
    id,
    text,
    completed: false,
    listId,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  todos.set(id, todo)
  return todo
}

function getTodos(listId: string = 'default'): Todo[] {
  return Array.from(todos.values()).filter(todo => todo.listId === listId)
}

function updateTodo(id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>): Todo | null {
  const todo = todos.get(id)
  if (!todo) return null
  
  const updated: Todo = { ...todo, ...updates, updatedAt: new Date() }
  todos.set(id, updated)
  return updated
}

function deleteTodo(id: string): boolean {
  return todos.delete(id)
}

app.get('/', (_req: Request, res: Response) => res.send('Hello World!'))

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
