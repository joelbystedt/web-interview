import React, { useState, useEffect, Fragment } from 'react'
import {
  Card,
  CardContent,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material'
import ReceiptIcon from '@mui/icons-material/Receipt'
import { api, Todo } from '../../api'
import { TodoListForm } from './TodoListForm'

export const TodoLists: React.FC = () => {
  const [activeList, setActiveList] = useState<string | null>(null)
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    api
      .getTodos()
      .then(setTodos)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' p={4}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Fragment>
      <Card>
        <CardContent>
          <Typography component='h2'>My Todos</Typography>
          <List>
            {todos.map((todo) => (
              <ListItemButton key={todo.id}>
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText
                  primary={todo.text}
                  secondary={todo.completed ? 'Completed' : 'Pending'}
                />
              </ListItemButton>
            ))}
          </List>
          {todos.length === 0 && <Typography color='textSecondary'>No todos yet</Typography>}
          <TodoListForm
            todoList={{ id: '1', title: 'My Todo List', todos: todos.map(todo => todo.text) }}
            saveTodoList={() => {}}
          />
        </CardContent>
      </Card>
    </Fragment>
  )
}
