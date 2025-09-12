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
  onTodoChange: (todoList: TodoList) => void
}

export const TodoListForm: React.FC<TodoListFormProps> = ({ todoList, onTodoChange }) => {
  const [todos, setTodos] = useState<Todo[]>(todoList.todos)
  const [newTodos, setNewTodos] = useState<string[]>([''])

  const updateParent = (updatedTodos: Todo[]) => {
    onTodoChange({ ...todoList, todos: updatedTodos })
  }

  const updateTodoAt = (index: number, updater: (t: Todo) => Todo) => {
    setTodos((prev) => {
      const updated = prev.map((t, i) => (i === index ? updater(t) : t))
      updateParent(updated)
      return updated
    })
  }

  const removeTodoAt = (index: number) => {
    setTodos((prev) => {
      const updated = prev.filter((_, i) => i !== index)
      updateParent(updated)
      return updated
    })
  }

  const createNewTodo = async (text: string, index: number) => {
    const newTodo = await TodoListService.createTodo(todoList.id, text)
    setTodos((prev) => {
      const updated = [...prev, newTodo]
      updateParent(updated)
      return updated
    })

    setNewTodos((prev) => {
      const updated = [...prev.slice(0, index), ...prev.slice(index + 1)]
      return updated.length === 0 || index === prev.length - 1 ? [...updated, ''] : updated
    })
  }

  const updateExistingTodo = async (todoId: string, text: string) => {
    await TodoListService.updateTodo(todoList.id, todoId, text)
  }

  const deleteExistingTodo = async (todoId: string, index: number) => {
    await TodoListService.deleteTodo(todoList.id, todoId)
    removeTodoAt(index)
  }

  return (
    <Card sx={{ margin: '0 1rem' }}>
      <CardContent>
        <Typography component='h2'>{todoList.name}</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          {todos.map((todo, index) => (
            <TodoRow
              key={todo.id}
              completed={todo.completed}
              value={todo.text}
              onChange={(event) => updateTodoAt(index, (t) => ({ ...t, text: event.target.value }))}
              onSave={() => updateExistingTodo(todo.id, todo.text)}
              onDelete={() => deleteExistingTodo(todo.id, index)}
              onToggleComplete={() =>
                updateTodoAt(index, (t) => ({ ...t, completed: !t.completed }))
              }
            />
          ))}

          {newTodos.map((text, index) => (
            <TodoRow
              key={`new-${index}`}
              completed={false}
              value={text}
              onChange={(event) =>
                setNewTodos((prev) => prev.map((t, i) => (i === index ? event.target.value : t)))
              }
              onSave={() => createNewTodo(text, index)}
              onDelete={() => setNewTodos((prev) => prev.filter((_, i) => i !== index))}
            />
          ))}

          <AddTodoButton onClick={() => setNewTodos((prev) => [...prev, ''])} />
        </div>
      </CardContent>
    </Card>
  )
}

const TodoRow: React.FC<{
  completed: boolean
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onSave: () => Promise<void> | void
  onDelete: () => Promise<void> | void
  onToggleComplete?: () => void
}> = ({ completed, value, onChange, onToggleComplete, onSave, onDelete }) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Checkbox
        sx={{
          margin: '8px',
          color: 'gray',
          '&.Mui-checked': {
            color: 'green',
          },
        }}
        checked={completed}
        disabled={isFocused}
        onChange={onToggleComplete}
      />
      <TextField
        sx={{ flexGrow: 1, margin: '1rem', marginLeft: '0', marginRight: '0', maxWidth: '600px' }}
        size='small'
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

const AddTodoButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <CardActions>
    <Button type='button' color='primary' onClick={onClick}>
      Add Todo <AddIcon />
    </Button>
  </CardActions>
)
