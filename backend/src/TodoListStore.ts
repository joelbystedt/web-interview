import { CONFIG } from './config.js'
import { Result, ok, err } from './result.js'

export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

export interface TodoList {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  todos: Todo[]
}

export class TodoListStore {
  private todoLists = new Map<string, TodoList>()

  constructor() {
    const now = new Date()
    this.todoLists.set(CONFIG.DEFAULT_LIST.ID, {
      id: CONFIG.DEFAULT_LIST.ID,
      name: CONFIG.DEFAULT_LIST.NAME,
      createdAt: now,
      updatedAt: now,
      todos: [],
    })
  }

  // TodoList methods
  createTodoList(name: string): Result<TodoList> {
    if (!name) return err(CONFIG.ERROR_MESSAGES.TODO_TEXT_REQUIRED, 400)

    const id = crypto.randomUUID()
    const now = new Date()
    const todoList: TodoList = {
      id,
      name: name.trim(),
      createdAt: now,
      updatedAt: now,
      todos: [],
    }

    this.todoLists.set(id, todoList)
    return ok(todoList)
  }

  getTodoLists(): Result<TodoList[]> {
    const lists = Array.from(this.todoLists.values())
    return ok(lists)
  }

  getTodoList(id: string): Result<TodoList> {
    const list = this.todoLists.get(id)
    if (!list) return err(CONFIG.ERROR_MESSAGES.LIST_NOT_FOUND, 404)
    return ok(list)
  }

  updateTodoList(id: string, updates: { name?: string }): Result<TodoList> {
    const list = this.todoLists.get(id)
    if (!list) return err(CONFIG.ERROR_MESSAGES.LIST_NOT_FOUND, 404)
    if (!updates.name) return err(CONFIG.ERROR_MESSAGES.TODO_TEXT_REQUIRED, 400)

    const updated: TodoList = {
      ...list,
      name: updates.name.trim(),
      updatedAt: new Date(),
    }

    this.todoLists.set(id, updated)
    return ok(updated)
  }

  deleteTodoList(id: string): Result<{ deleted: boolean }> {
    if (id === CONFIG.DEFAULT_LIST.ID) {
      return err('Cannot delete default list', 400)
    }

    const deleted = this.todoLists.delete(id)
    if (!deleted) return err(CONFIG.ERROR_MESSAGES.LIST_NOT_FOUND, 404)
    return ok({ deleted: true })
  }

  // Todo methods
  createTodo(text: string, listId: string = CONFIG.DEFAULT_LIST.ID): Result<Todo> {
    if (!text) return err(CONFIG.ERROR_MESSAGES.TODO_TEXT_REQUIRED, 400)

    const list = this.todoLists.get(listId)
    if (!list) return err(CONFIG.ERROR_MESSAGES.LIST_NOT_FOUND, 404)

    const id = crypto.randomUUID()
    const now = new Date()
    const todo: Todo = {
      id,
      text: text.trim(),
      completed: false,
      createdAt: now,
      updatedAt: now,
    }

    list.todos.push(todo)
    list.updatedAt = now
    this.todoLists.set(listId, list)

    return ok(todo)
  }

  updateTodo(
    todoId: string,
    listId: string,
    updates: Partial<Omit<Todo, 'id' | 'createdAt'>>
  ): Result<Todo> {
    const list = this.todoLists.get(listId)
    if (!list) return err(CONFIG.ERROR_MESSAGES.LIST_NOT_FOUND, 404)

    const todoIndex = list.todos.findIndex((todo) => todo.id === todoId)
    if (todoIndex === -1) return err(CONFIG.ERROR_MESSAGES.TODO_NOT_FOUND, 404)

    if (updates.text !== undefined && !updates.text) {
      return err(CONFIG.ERROR_MESSAGES.TODO_TEXT_REQUIRED, 400)
    }

    const now = new Date()
    const updated: Todo = {
      ...list.todos[todoIndex],
      ...updates,
      ...(updates.text && { text: updates.text.trim() }),
      updatedAt: now,
    }

    list.todos[todoIndex] = updated
    list.updatedAt = now
    this.todoLists.set(listId, list)

    return ok(updated)
  }

  deleteTodo(todoId: string, listId: string): Result<{ deleted: boolean }> {
    const list = this.todoLists.get(listId)
    if (!list) return err(CONFIG.ERROR_MESSAGES.LIST_NOT_FOUND, 404)

    const todoIndex = list.todos.findIndex((todo) => todo.id === todoId)
    if (todoIndex === -1) return err(CONFIG.ERROR_MESSAGES.TODO_NOT_FOUND, 404)

    list.todos.splice(todoIndex, 1)
    list.updatedAt = new Date()
    this.todoLists.set(listId, list)

    return ok({ deleted: true })
  }
}
