const API_URL = 'http://localhost:3001/api/todos'

export interface Todo {
  id: string
  text: string
  completed: boolean
  listId: string
  createdAt: string
  updatedAt: string
  dueDate?: string
}

interface ApiResponse<T> {
  success: boolean
  data: T
  count?: number
}

export const api = {
  async getTodos(): Promise<Todo[]> {
    const response = await fetch(API_URL)
    const data: ApiResponse<Todo[]> = await response.json()
    return data.data
  },

  async createTodo(text: string): Promise<Todo> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    const data: ApiResponse<Todo> = await response.json()
    return data.data
  },

  async updateTodo(id: string, updates: Partial<Pick<Todo, 'text' | 'completed'>>): Promise<Todo> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    const data: ApiResponse<Todo> = await response.json()
    return data.data
  },

  async deleteTodo(id: string): Promise<boolean> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    })
    return response.ok
  },
}
