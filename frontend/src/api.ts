const API_URL = 'http://localhost:3001/api/lists'

export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

export interface TodoList {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  active: boolean
  todos: Todo[]
}

interface Response<T> {
  success: boolean
  data: T
}

export const api = {
  async getTodoLists(): Promise<TodoList[]> {
    const response = await fetch(API_URL)
    const data: Response<TodoList[]> = await response.json()
    return data.data
  },

  async getTodoList(id: string): Promise<TodoList> {
    const response = await fetch(`${API_URL}/${id}`)
    const data: Response<TodoList> = await response.json()
    return data.data
  },

  async createTodoList(name: string): Promise<TodoList> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    const data: Response<TodoList> = await response.json()
    return data.data
  },

  async updateTodoList(id: string, name: string): Promise<TodoList> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    const data: Response<TodoList> = await response.json()
    return data.data
  },

  async deleteTodoList(id: string): Promise<boolean> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    })
    return response.ok
  },

  async createTodo(listId: string, text: string): Promise<Todo> {
    const response = await fetch(`${API_URL}/${listId}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    const data: Response<Todo> = await response.json()
    return data.data
  },

  async updateTodo(
    listId: string,
    todoId: string,
    updates: Partial<Pick<Todo, 'text' | 'completed'>>
  ): Promise<Todo> {
    const response = await fetch(`${API_URL}/${listId}/todos/${todoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    const data: Response<Todo> = await response.json()
    return data.data
  },

  async deleteTodo(listId: string, todoId: string): Promise<boolean> {
    const response = await fetch(`${API_URL}/${listId}/todos/${todoId}`, {
      method: 'DELETE',
    })
    return response.ok
  },
}
