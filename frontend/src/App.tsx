import React from 'react'
import { AppBar, Toolbar, Typography } from '@mui/material'
import { TodoLists } from './todos/components/TodoLists'

const MainAppBar: React.FC = () => {
  return (
    <AppBar position='static' color='primary'>
      <Toolbar>
        <Typography variant='h6' color='inherit'>
          Things to do
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

const mainWrapperStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
}
const centerContentWrapper: React.CSSProperties = { display: 'flex', justifyContent: 'center' }
const contentWrapperStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '80rem',
  flexGrow: 1,
  padding: '2rem',
}

interface MainWrapperProps {
  children: React.ReactNode
}

const MainWrapper: React.FC<MainWrapperProps> = ({ children }) => {
  return (
    <div style={mainWrapperStyle}>
      <MainAppBar />
      <div style={centerContentWrapper}>
        <div style={contentWrapperStyle}>{children}</div>
      </div>
    </div>
  )
}

const App: React.FC = () => {
  return (
    <MainWrapper>
      <TodoLists />
    </MainWrapper>
  )
}

export default App
