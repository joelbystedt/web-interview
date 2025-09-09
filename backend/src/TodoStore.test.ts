import { TodoStore } from './TodoStore.js'
import { CONFIG } from './config.js'

describe('TodoStore', () => {
  let store: TodoStore

  beforeEach(() => {
    store = new TodoStore()
  })

  describe('createTodo', () => {
    it('should create a todo with required fields', () => {
      const todo = store.createTodo('Test task')

      expect(todo).toMatchObject({
        text: 'Test task',
        completed: false,
        listId: CONFIG.DEFAULT_LIST.ID,
      })
      expect(todo.id).toBeDefined()
      expect(todo.createdAt).toBeInstanceOf(Date)
      expect(todo.updatedAt).toBeInstanceOf(Date)
    })
  })

  describe('getTodos', () => {
    it('should return empty array when no todos exist', () => {
      const todos = store.getTodos()
      expect(todos).toEqual([])
    })

    it('should return todos for default list', () => {
      store.createTodo('Task 1')
      store.createTodo('Task 2')

      const todos = store.getTodos()

      expect(todos).toHaveLength(2)
      expect(todos[0].text).toBe('Task 1')
      expect(todos[1].text).toBe('Task 2')
    })

    it('should filter todos by listId', () => {
      store.createTodo('Default task')
      store.createTodo('Custom task', 'custom-list')

      const defaultTodos = store.getTodos()
      const customTodos = store.getTodos('custom-list')

      expect(defaultTodos).toHaveLength(1)
      expect(customTodos).toHaveLength(1)
      expect(defaultTodos[0].text).toBe('Default task')
      expect(customTodos[0].text).toBe('Custom task')
    })
  })

  describe('updateTodo', () => {
    it('should update todo fields', async () => {
      const todo = store.createTodo('Original task')

      await new Promise((resolve) => setTimeout(resolve, 1))

      const updated = store.updateTodo(todo.id, {
        text: 'Updated task',
        completed: true,
      })

      expect(updated).toMatchObject({
        id: todo.id,
        text: 'Updated task',
        completed: true,
        listId: CONFIG.DEFAULT_LIST.ID,
      })
      expect(updated!.updatedAt.getTime()).toBeGreaterThan(todo.updatedAt.getTime())
    })

    it('should return null for non-existent todo', () => {
      const result = store.updateTodo('non-existent-id', { text: 'Updated' })

      expect(result).toBeNull()
    })

    it('should not allow updating id or createdAt', () => {
      const todo = store.createTodo('Test task')
      const originalId = todo.id
      const originalCreatedAt = todo.createdAt

      const updated = store.updateTodo(todo.id, {
        text: 'Updated task',
      })

      expect(updated!.id).toBe(originalId)
      expect(updated!.createdAt).toEqual(originalCreatedAt)
    })
  })

  describe('deleteTodo', () => {
    it('should delete existing todo', () => {
      const todo = store.createTodo('Task to delete')

      const result = store.deleteTodo(todo.id)

      expect(result).toBe(true)
      expect(store.getTodos()).toHaveLength(0)
    })

    it('should return false for non-existent todo', () => {
      const result = store.deleteTodo('non-existent-id')

      expect(result).toBe(false)
    })
  })
})
