import React, { useState, useEffect } from 'react'
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

export const TodoLists: React.FC = () => {
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
      </CardContent>
    </Card>
  )
}
