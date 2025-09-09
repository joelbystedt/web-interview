import express, { Request, Response } from 'express'
import { todoStore } from '../index.js'
import { CONFIG } from '../config.js'

const router = express.Router()

// GET /api/todos - Get all todos
router.get('/', (req: Request, res: Response) => {
  const { listId } = req.query
  const todos = todoStore.getTodos(listId as string)

  res.json({
    success: true,
    data: todos,
    count: todos.length,
  })
})

// POST /api/todos - Create new todo
router.post('/', (req: Request, res: Response) => {
  const { text, listId } = req.body

  if (!text) {
    return res.status(400).json({
      success: false,
      error: CONFIG.ERROR_MESSAGES.TODO_TEXT_REQUIRED,
    })
  }

  const result = todoStore.createTodo(text, listId)

  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: result.error,
    })
  }

  res.status(201).json({
    success: true,
    data: result.data,
  })
})

// PUT /api/todos/:id - Update todo
router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params
  const updates = req.body

  const result = todoStore.updateTodo(id, updates)

  if (!result.success) {
    return res.status(404).json({
      success: false,
      error: result.error,
    })
  }

  res.json({
    success: true,
    data: result.data,
  })
})

// DELETE /api/todos/:id - Delete todo
router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params

  const result = todoStore.deleteTodo(id)

  if (!result.success) {
    return res.status(404).json({
      success: false,
      error: result.error,
    })
  }

  res.json({
    success: true,
    message: CONFIG.MESSAGES.TODO_DELETED_SUCCESS,
  })
})

export default router
