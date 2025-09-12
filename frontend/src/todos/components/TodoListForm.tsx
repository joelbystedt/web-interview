import React, { useState } from 'react'
import { TextField, Card, CardContent, CardActions, Button, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { TodoList, Todo } from '../../api'
import { TodoListService } from '../services'

interface TodoListFormProps {
  todoList: TodoList
}

export const TodoListForm: React.FC<TodoListFormProps> = ({ todoList }) => {
  const [todos, setTodos] = useState<Todo[]>(todoList.todos)
  const [newTodos, setNewTodos] = useState<string[]>([''])

  return (
    <Card sx={{ margin: '0 1rem' }}>
      <CardContent>
        <Typography component='h2'>{todoList.name}</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          {/* Existing todos */}
          {todos.map((todo, index) => (
            <div key={todo.id} style={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ margin: '8px' }} variant='h6'>
                {index + 1}
              </Typography>
              <TextField
                sx={{ flexGrow: 1, marginTop: '1rem' }}
                label='What to do?'
                value={todo.text}
                onChange={(event) => {
                  setTodos([
                    ...todos.slice(0, index),
                    { ...todo, text: event.target.value },
                    ...todos.slice(index + 1),
                  ])
                }}
                onBlur={async () => {
                  if (todo.text.trim()) {
                    await TodoListService.updateTodo(todoList.id, todo.id, todo.text)
                  }
                }}
              />
              <Button
                sx={{ margin: '8px' }}
                size='small'
                color='secondary'
                onClick={async () => {
                  await TodoListService.deleteTodo(todoList.id, todo.id)
                  setTodos([
                    ...todos.slice(0, index),
                    ...todos.slice(index + 1),
                  ])
                }}
              >
                <DeleteIcon />
              </Button>
            </div>
          ))}
          
          {/* New todos */}
          {newTodos.map((text, index) => (
            <div key={`new-${index}`} style={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ margin: '8px' }} variant='h6'>
                {todos.length + index + 1}
              </Typography>
              <TextField
                sx={{ flexGrow: 1, marginTop: '1rem' }}
                label='What to do?'
                value={text}
                onChange={(event) => {
                  setNewTodos([
                    ...newTodos.slice(0, index),
                    event.target.value,
                    ...newTodos.slice(index + 1),
                  ])
                }}
                onBlur={async () => {
                  if (text.trim()) {
                    const newTodo = await TodoListService.createTodo(todoList.id, text)
                    setTodos([...todos, newTodo])
                    // Remove this new todo from newTodos array
                    const updatedNewTodos = [
                      ...newTodos.slice(0, index),
                      ...newTodos.slice(index + 1),
                    ]
                    // If this was the last todo and it's now empty, add a new empty one
                    if (updatedNewTodos.length === 0 || (index === newTodos.length - 1)) {
                      setNewTodos([...updatedNewTodos, ''])
                    } else {
                      setNewTodos(updatedNewTodos)
                    }
                  }
                }}
              />
              <Button
                sx={{ margin: '8px' }}
                size='small'
                color='secondary'
                onClick={() => {
                  setNewTodos([
                    ...newTodos.slice(0, index),
                    ...newTodos.slice(index + 1),
                  ])
                }}
              >
                <DeleteIcon />
              </Button>
            </div>
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