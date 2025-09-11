import { CONFIG } from './config.js'
import { Result, ok, err } from './result.js'

export interface Todo {
  id: string
  text: string
  completed: boolean
  listId: string
  createdAt: Date
  updatedAt: Date
  dueDate?: Date
}

export interface TodoList {
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

  createTodo(text: string, listId: string = CONFIG.DEFAULT_LIST.ID): Result<Todo> {
    if (!text) return err(CONFIG.ERROR_MESSAGES.TODO_TEXT_REQUIRED, 400)

    const id = crypto.randomUUID()
    const todo: Todo = {
      id,
      text: text.trim(),
      completed: false,
      listId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.todos.set(id, todo)
    return ok(todo)
  }

  getTodos(listId: string = CONFIG.DEFAULT_LIST.ID): Result<Todo[]> {
    const todos = Array.from(this.todos.values()).filter((todo) => todo.listId === listId)
    return ok(todos)
  }

  updateTodo(id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>): Result<Todo> {
    const todo = this.todos.get(id)
    if (!todo) return err(CONFIG.ERROR_MESSAGES.TODO_NOT_FOUND, 404)
    if (!updates.text) return err(CONFIG.ERROR_MESSAGES.TODO_TEXT_REQUIRED, 400)

    const updated: Todo = {
      ...todo,
      ...updates,
      text: updates.text.trim(),
      updatedAt: new Date(),
    }

    this.todos.set(id, updated)
    return ok(updated)
  }

  deleteTodo(id: string): Result<{ deleted: boolean }> {
    const deleted = this.todos.delete(id)
    if (!deleted) return err(CONFIG.ERROR_MESSAGES.TODO_NOT_FOUND, 404)
    else return ok({ deleted: true })
  }
}
