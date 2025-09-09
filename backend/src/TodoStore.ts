import { CONFIG } from './config.js'
import { Result, ok, err } from './result.js'

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

  createTodo(text: string, listId: string = CONFIG.DEFAULT_LIST.ID): Result<Todo> {
    if (!text) {
      return err(CONFIG.ERROR_MESSAGES.TODO_TEXT_REQUIRED)
    }

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

  getTodos(listId: string = CONFIG.DEFAULT_LIST.ID): Todo[] {
    return Array.from(this.todos.values()).filter((todo) => todo.listId === listId)
  }

  updateTodo(id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>): Result<Todo> {
    const todo = this.todos.get(id)
    if (!todo) {
      return err(`${CONFIG.ERROR_MESSAGES.TODO_NOT_FOUND} with id '${id}'`)
    }

    if (updates.text !== undefined && !updates.text?.trim()) {
      return err(CONFIG.ERROR_MESSAGES.TODO_TEXT_REQUIRED)
    }

    const updated: Todo = {
      ...todo,
      ...updates,
      text: updates.text ? updates.text.trim() : todo.text,
      updatedAt: new Date(),
    }
    this.todos.set(id, updated)
    return ok(updated)
  }

  deleteTodo(id: string): Result<{ deleted: boolean }> {
    const deleted = this.todos.delete(id)
    if (!deleted) {
      return err(`${CONFIG.ERROR_MESSAGES.TODO_NOT_FOUND} with id '${id}'`)
    }
    return ok({ deleted: true })
  }
}

export type { Todo, TodoList }
