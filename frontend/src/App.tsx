import './App.css'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import Navigation from './components/Navigation'
import { CssBaseline } from '@mui/material'

function App() {
  return (
    <div className="app">
      <CssBaseline />
      <Navigation />
      <Outlet />
      <ScrollRestoration />
    </div>
  )
}

export default App
