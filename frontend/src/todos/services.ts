import { api, TodoList } from '../api'

export class TodoListService {
  static async getTodoLists() {
    return await api.getTodoLists()
  }

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

  static async createTodo(listId: string, text: string) {
    return await api.createTodo(listId, text)
  }

  static async updateTodo(listId: string, todoId: string, text: string) {
    return await api.updateTodo(listId, todoId, { text })
  }

  static async deleteTodo(listId: string, todoId: string) {
    return await api.deleteTodo(listId, todoId)
  }
}
