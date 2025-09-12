import React, { useState } from 'react'
import {
  TextField,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Checkbox,
  IconButton,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { TodoList, Todo } from '../../api'
import { TodoListService } from '../services'

interface TodoListFormProps {
  todoList: TodoList
  onTodoChange?: (todoList: TodoList) => void
}

const TodoRow: React.FC<{
  completed: boolean
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onToggleComplete: () => void
  onSave: () => Promise<void> | void
  onDelete: () => Promise<void> | void
}> = ({ completed, value, onChange, onToggleComplete, onSave, onDelete }) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Checkbox
        sx={{
          margin: '8px',
          color: 'green',
          '&.Mui-checked': {
            color: 'green',
          },
        }}
        checked={completed}
        disabled={isFocused}
        onChange={onToggleComplete}
      />
      <TextField
        sx={{ flexGrow: 1, marginTop: '1rem', maxWidth: '600px' }}
        size="small"
        value={value}
        disabled={completed}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={async () => {
          setIsFocused(false)
          await onSave()
        }}
        onKeyDown={async (event) => {
          if (event.key === 'Enter') {
            event.currentTarget.blur()
            await onSave()
          }
        }}
      />

      <IconButton sx={{ margin: '8px' }} size='small' disabled={isFocused} onClick={onDelete}>
        <DeleteIcon />
      </IconButton>
    </div>
  )
}

export const TodoListForm: React.FC<TodoListFormProps> = ({ todoList, onTodoChange }) => {
  const [todos, setTodos] = useState<Todo[]>(todoList.todos)
  const [newTodos, setNewTodos] = useState<string[]>([''])

  const updateParent = (updatedTodos: Todo[]) => {
    onTodoChange?.({ ...todoList, todos: updatedTodos })
  }

  const createNewTodo = async (text: string, index: number) => {
    const newTodo = await TodoListService.createTodo(todoList.id, text)
    const updatedTodos = [...todos, newTodo]
    setTodos(updatedTodos)
    updateParent(updatedTodos)

    const updatedNewTodos = [...newTodos.slice(0, index), ...newTodos.slice(index + 1)]
    if (updatedNewTodos.length === 0 || index === newTodos.length - 1) {
      setNewTodos([...updatedNewTodos, ''])
    } else {
      setNewTodos(updatedNewTodos)
    }
  }

  const updateExistingTodo = async (todoId: string, text: string) => {
    if (text.trim()) {
      await TodoListService.updateTodo(todoList.id, todoId, text)
    }
  }

  const deleteExistingTodo = async (todoId: string, index: number) => {
    const todo = todos[index]
    if (todo.text.trim()) {
      await TodoListService.updateTodo(todoList.id, todoId, todo.text)
    }
    await TodoListService.deleteTodo(todoList.id, todoId)
    const updatedTodos = [...todos.slice(0, index), ...todos.slice(index + 1)]
    setTodos(updatedTodos)
    updateParent(updatedTodos)
  }

  return (
    <Card sx={{ margin: '0 1rem' }}>
      <CardContent>
        <Typography component='h2'>{todoList.name}</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          {/* Existing todos */}
          {todos.map((todo, index) => (
            <TodoRow
              key={todo.id}
              completed={todo.completed}
              value={todo.text}
              onChange={(event) => {
                setTodos([
                  ...todos.slice(0, index),
                  { ...todo, text: event.target.value },
                  ...todos.slice(index + 1),
                ])
              }}
              onToggleComplete={() => {
                setTodos([
                  ...todos.slice(0, index),
                  { ...todo, completed: !todo.completed },
                  ...todos.slice(index + 1),
                ])
              }}
              onSave={() => updateExistingTodo(todo.id, todo.text)}
              onDelete={() => deleteExistingTodo(todo.id, index)}
            />
          ))}

          {/* New todos */}
          {newTodos.map((text, index) => (
            <TodoRow
              key={`new-${index}`}
              completed={false}
              value={text}
              onChange={(event) => {
                setNewTodos([
                  ...newTodos.slice(0, index),
                  event.target.value,
                  ...newTodos.slice(index + 1),
                ])
              }}
              onToggleComplete={() => {}}
              onSave={() => {
                if (text.trim()) {
                  return createNewTodo(text, index)
                }
              }}
              onDelete={async () => {
                if (text.trim()) {
                  await createNewTodo(text, index)
                } else {
                  setNewTodos([...newTodos.slice(0, index), ...newTodos.slice(index + 1)])
                }
              }}
            />
          ))}

          <CardActions>
            <Button
              type='button'
              color='primary'
              onClick={() => {
                setNewTodos([...newTodos, ''])
              }}
            >
              Add Todo <AddIcon />
            </Button>
          </CardActions>
        </div>
      </CardContent>
    </Card>
  )
}
