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
  IconButton,
} from '@mui/material'
import ReceiptIcon from '@mui/icons-material/Receipt'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { api, TodoList } from '../../api'
import { TodoListForm } from './TodoListForm'
import { TodoListService } from '../services'

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
          <TodoListsHeader todoLists={todoLists} setTodoLists={setTodoLists} />
          <TodoListsContent todoLists={todoLists} setTodoLists={setTodoLists} />
        </CardContent>
      </Card>
      <TodoListActive todoLists={todoLists} setTodoLists={setTodoLists} />
    </Fragment>
  )
}

const TodoListsHeader: React.FC<{
  todoLists: TodoList[]
  setTodoLists: React.Dispatch<React.SetStateAction<TodoList[]>>
}> = ({ todoLists, setTodoLists }) => {
  return (
    <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
      <Typography component='h2'>My Todos</Typography>
      <Button
        variant='contained'
        startIcon={<AddIcon />}
        onClick={() => TodoListService.createNewTodoList(todoLists, setTodoLists)}
      >
        New List
      </Button>
    </Box>
  )
}

const TodoListsContent: React.FC<{
  todoLists: TodoList[]
  setTodoLists: React.Dispatch<React.SetStateAction<TodoList[]>>
}> = ({ todoLists, setTodoLists }) => {
  return (
    <List>
      {todoLists.map((todoList) => (
        <ListItemButton
          key={todoList.id}
          onClick={() => TodoListService.selectTodoList(todoList.id, setTodoLists)}
          selected={todoList.active}
        >
          <ListItemIcon>
            <ReceiptIcon />
          </ListItemIcon>
          <ListItemText primary={todoList.name} secondary={`${todoList.todos.length} todos`} />
          <IconButton
            edge='end'
            onClick={async (e) => {
              e.stopPropagation()
              await TodoListService.deleteTodoList(todoList.id, setTodoLists)
            }}
          >
            <DeleteIcon />
          </IconButton>
        </ListItemButton>
      ))}
    </List>
  )
}

const TodoListActive: React.FC<{ 
  todoLists: TodoList[]
  setTodoLists: React.Dispatch<React.SetStateAction<TodoList[]>>
}> = ({ todoLists, setTodoLists }) => {
  const activeList = todoLists.find((list) => list.active)
  
  const handleTodoChange = (updatedTodoList: TodoList) => {
    setTodoLists(lists => 
      lists.map(list => 
        list.id === updatedTodoList.id ? updatedTodoList : list
      )
    )
  }
  
  return activeList ? (
    <div style={{ marginTop: '1rem' }}>
      <TodoListForm 
        key={activeList.id} 
        todoList={activeList}
        onTodoChange={handleTodoChange}
      />
    </div>
  ) : null
}
