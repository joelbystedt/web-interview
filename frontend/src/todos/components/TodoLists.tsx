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
  Button,
} from '@mui/material'
import ReceiptIcon from '@mui/icons-material/Receipt'
import AddIcon from '@mui/icons-material/Add'
import { api, TodoList } from '../../api'
import { TodoListForm } from './TodoListForm'

export const TodoLists: React.FC = () => {
  const [todoLists, setTodoLists] = useState<TodoList[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    api
      .getTodoLists()
      .then(setTodoLists)
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
          <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
            <Typography component='h2'>My Todos</Typography>
            <Button
              variant='contained'
              startIcon={<AddIcon />}
              onClick={async () => {
                const newList = await api.createTodoList(`New List ${todoLists.length + 1}`)
                setTodoLists([...todoLists, newList])
              }}
            >
              New List
            </Button>
          </Box>
          <List>
            {todoLists.map((todoList) => (
              <ListItemButton
                key={todoList.id}
                onClick={() => {
                  setTodoLists((lists) =>
                    lists.map((list) => ({
                      ...list,
                      active: list.id === todoList.id,
                    }))
                  )
                }}
                selected={todoList.active}
              >
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText
                  primary={todoList.name}
                  secondary={`${todoList.todos.length} todos`}
                />
              </ListItemButton>
            ))}
          </List>
          {todoLists.length === 0 && <Typography color='textSecondary'>No todos yet</Typography>}
        </CardContent>
      </Card>
      {(() => {
        const activeList = todoLists.find((list) => list.active)
        return activeList ? (
          <TodoListForm key={activeList.id} todoList={activeList} saveTodoList={() => {}} />
        ) : null
      })()}
    </Fragment>
  )
}
