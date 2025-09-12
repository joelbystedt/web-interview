import express, { Request, Response } from 'express'
import { todoListStore } from '../index.js'

const router = express.Router()

// GET /api/lists - Get all todo lists
router.get('/', (_req: Request, res: Response) => {
  const result = todoListStore.getTodoLists()
  const { success, data } = result

  res.json({
    success,
    data,
  })
})

// GET /api/lists/:id - Get specific todo list with todos
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params

  const result = todoListStore.getTodoList(id)
  const { success, status, data, error } = result

  if (!success) {
    return res.status(status).json({
      success,
      error,
    })
  }

  res.json({
    success,
    data,
  })
})

// POST /api/lists - Create new todo list
router.post('/', (req: Request, res: Response) => {
  const { name } = req.body

  const result = todoListStore.createTodoList(name)
  const { success, status, error, data } = result

  if (!success) {
    return res.status(status).json({
      success,
      error,
    })
  }

  res.status(201).json({
    success,
    data,
  })
})

// PUT /api/lists/:id - Update todo list
router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params
  const updates = req.body

  const result = todoListStore.updateTodoList(id, updates)
  const { success, status, data, error } = result

  if (!success) {
    return res.status(status).json({
      success,
      error,
    })
  }

  res.json({
    success,
    data,
  })
})

// DELETE /api/lists/:id - Delete todo list
router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params

  const result = todoListStore.deleteTodoList(id)
  const { success, status, error, data } = result

  if (!success) {
    return res.status(status).json({
      success,
      error,
    })
  }

  res.json({
    success,
    data,
  })
})

// POST /api/lists/:id/todos - Create new todo in specific list
router.post('/:id/todos', (req: Request, res: Response) => {
  const { id } = req.params
  const { text } = req.body

  const result = todoListStore.createTodo(text, id)
  const { success, status, error, data } = result

  if (!success) {
    return res.status(status).json({
      success,
      error,
    })
  }

  res.status(201).json({
    success,
    data,
  })
})

// PUT /api/lists/:listId/todos/:todoId - Update todo in specific list
router.put('/:listId/todos/:todoId', (req: Request, res: Response) => {
  const { listId, todoId } = req.params
  const updates = req.body

  const result = todoListStore.updateTodo(todoId, listId, updates)
  const { success, status, data, error } = result

  if (!success) {
    return res.status(status).json({
      success,
      error,
    })
  }

  res.json({
    success,
    data,
  })
})

// DELETE /api/lists/:listId/todos/:todoId - Delete todo from specific list
router.delete('/:listId/todos/:todoId', (req: Request, res: Response) => {
  const { listId, todoId } = req.params

  const result = todoListStore.deleteTodo(todoId, listId)
  const { success, status, error, data } = result

  if (!success) {
    return res.status(status).json({
      success,
      error,
    })
  }

  res.json({
    success,
    data,
  })
})

export default router
