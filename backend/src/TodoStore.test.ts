import { TodoStore } from './TodoStore.js'
import { CONFIG } from './config.js'

describe('TodoStore', () => {
  let store: TodoStore

  beforeEach(() => {
    store = new TodoStore()
  })

  describe('createTodo', () => {
    it('should create a todo with required fields', () => {
      const result = store.createTodo('Test task')

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toMatchObject({
          text: 'Test task',
          completed: false,
          listId: CONFIG.DEFAULT_LIST.ID,
        })
        expect(result.data?.id).toBeDefined()
        expect(result.data?.createdAt).toBeInstanceOf(Date)
        expect(result.data?.updatedAt).toBeInstanceOf(Date)
      }
    })

    it('should return error for empty text', () => {
      const result = store.createTodo('')

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe(CONFIG.ERROR_MESSAGES.TODO_TEXT_REQUIRED)
      }
    })
  })

  describe('getTodos', () => {
    it('should return todos for default list', () => {
      const result1 = store.createTodo('Task 1')
      const result2 = store.createTodo('Task 2')

      expect(result1.success && result2.success).toBe(true)

      const todos = store.getTodos()

      expect(todos.data).toHaveLength(2)
      expect(todos.data?.[0].text).toBe('Task 1')
      expect(todos.data?.[1].text).toBe('Task 2')
    })

    it('should filter todos by listId', () => {
      const result1 = store.createTodo('Default task')
      const result2 = store.createTodo('Custom task', 'custom-list')

      expect(result1.success && result2.success).toBe(true)

      const defaultTodos = store.getTodos()
      const customTodos = store.getTodos('custom-list')

      expect(defaultTodos.data?.length).toBe(1)
      expect(customTodos.data?.length).toBe(1)
      expect(defaultTodos.data?.[0].text).toBe('Default task')
      expect(customTodos.data?.[0].text).toBe('Custom task')
    })
  })

  describe('updateTodo', () => {
    it('should update todo fields', async () => {
      const createResult = store.createTodo('Original task')
      expect(createResult.success).toBe(true)

      await new Promise((resolve) => setTimeout(resolve, 2))

      const updateResult = store.updateTodo(createResult.data!.id, {
        text: 'Updated task',
        completed: true,
      })

      expect(updateResult.success).toBe(true)
      if (updateResult.success) {
        expect(updateResult.data).toMatchObject({
          id: createResult.data?.id,
          text: 'Updated task',
          completed: true,
          listId: CONFIG.DEFAULT_LIST.ID,
        })
        expect(updateResult.data?.updatedAt.getTime()).toBeGreaterThan(
          createResult.data!.updatedAt.getTime()
        )
      }
    })

    it('should return error for non-existent todo', () => {
      const result = store.updateTodo('non-existent-id', { text: 'Updated' })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toContain('not found')
      }
    })

    it('should not allow updating id or createdAt', () => {
      const createResult = store.createTodo('Test task')
      expect(createResult.success).toBe(true)

      if (!createResult.success) return

      const updateResult = store.updateTodo(createResult.data!.id, {
        text: 'Updated task',
      })

      expect(updateResult.success).toBe(true)
      if (updateResult.success) {
        expect(updateResult.data!.id).toBe(createResult.data!.id)
        expect(updateResult.data!.createdAt).toEqual(createResult.data!.createdAt)
      }
    })
  })

  describe('deleteTodo', () => {
    it('should delete existing todo', () => {
      const createResult = store.createTodo('Task to delete')
      expect(createResult.success).toBe(true)

      if (!createResult.success) return

      const deleteResult = store.deleteTodo(createResult.data!.id)

      expect(deleteResult.success).toBe(true)
      if (deleteResult.success) {
        expect(deleteResult.data!.deleted).toBe(true)
      }
      expect(store.getTodos().data).toHaveLength(0)
    })

    it('should return error for non-existent todo', () => {
      const result = store.deleteTodo('non-existent-id')

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toContain('not found')
      }
    })
  })
})
