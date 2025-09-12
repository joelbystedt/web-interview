import { api, TodoList } from '../api'

export class TodoListService {
  static async createNewTodoList(
    todoLists: TodoList[],
    setTodoLists: React.Dispatch<React.SetStateAction<TodoList[]>>
  ) {
    const newList = await api.createTodoList(`New List ${todoLists.length + 1}`)
    setTodoLists([...todoLists, newList])
  }

  static selectTodoList(
    todoListId: string,
    setTodoLists: React.Dispatch<React.SetStateAction<TodoList[]>>
  ) {
    setTodoLists((lists) =>
      lists.map((list) => ({
        ...list,
        active: list.id === todoListId,
      }))
    )
  }

  static async deleteTodoList(
    todoListId: string,
    setTodoLists: React.Dispatch<React.SetStateAction<TodoList[]>>
  ) {
    await api.deleteTodoList(todoListId)
    setTodoLists((lists) => lists.filter((list) => list.id !== todoListId))
  }

  static async saveTodoList(id: string, { todos }: { todos: string[] }) {
    const validTodos = todos.filter(text => text.trim())
    if (validTodos.length > 0) {
      for (const text of validTodos) {
        await api.createTodo(id, text)
      }
    }
  }
}