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

  // TODO: Add config for content management
  constructor() {
    this.todoLists.set('default', { id: 'default', name: 'Default List' })
  }

  createTodo(text: string, listId: string = 'default'): Todo {
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

  getTodos(listId: string = 'default'): Todo[] {
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
