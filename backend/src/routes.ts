import express, { Request, Response } from 'express'
import { todoStore } from './index.js'

const router = express.Router()

// GET /api/todos - Get all todos
router.get('/', (req: Request, res: Response) => {
  const { listId } = req.query

  const result = todoStore.getTodos(listId as string)
  const { success, data } = result

  res.json({
    success,
    data,
  })
})

// POST /api/todos - Create new todo
router.post('/', (req: Request, res: Response) => {
  const { text, listId } = req.body

  const result = todoStore.createTodo(text, listId)
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

// PUT /api/todos/:id - Update todo
router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params
  const updates = req.body

  const result = todoStore.updateTodo(id, updates)
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

// DELETE /api/todos/:id - Delete todo
router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params

  const result = todoStore.deleteTodo(id)
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
