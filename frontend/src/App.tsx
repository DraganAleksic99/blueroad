import './App.css'
import { Outlet } from 'react-router-dom'
import Navigation from './components/Navigation'
import { CssBaseline } from '@mui/material'

function App() {
  return (
    <div className="app">
      <CssBaseline />
      <Navigation />
      <Outlet />
    </div>
  )
}

export default App
