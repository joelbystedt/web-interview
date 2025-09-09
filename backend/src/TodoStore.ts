import { CONFIG } from './config.js'

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

export class TodoStore {
  private todos = new Map<string, Todo>()
  private todoLists = new Map<string, TodoList>()

  constructor() {
    this.todoLists.set(CONFIG.DEFAULT_LIST.ID, {
      id: CONFIG.DEFAULT_LIST.ID,
      name: CONFIG.DEFAULT_LIST.NAME,
    })
  }

  createTodo(text: string, listId: string = CONFIG.DEFAULT_LIST.ID): Todo {
    const id = crypto.randomUUID()
    const todo: Todo = {
      id,
      text,
      completed: false,
      listId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.todos.set(id, todo)
    return todo
  }

  getTodos(listId: string = CONFIG.DEFAULT_LIST.ID): Todo[] {
    return Array.from(this.todos.values()).filter((todo) => todo.listId === listId)
  }

  updateTodo(id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>): Todo | null {
    const todo = this.todos.get(id)
    if (!todo) return null // TODO: Error handling

    const updated: Todo = { ...todo, ...updates, updatedAt: new Date() }
    this.todos.set(id, updated)
    return updated
  }

  deleteTodo(id: string): boolean {
    return this.todos.delete(id)
  }
}

export type { Todo, TodoList }
