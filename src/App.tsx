import './App.css'
import Navigation from './components/Navigation'
import MainRouter from './Router'
import { CssBaseline } from '@mui/material'

function App() {
  return (
    <div className="app">
      <CssBaseline />
      <Navigation />
      <MainRouter />
    </div>
  )
}

export default App
