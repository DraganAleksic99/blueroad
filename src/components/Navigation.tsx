import { AppBar, Typography, IconButton, Button, Toolbar } from '@mui/material'
import { Home } from '@mui/icons-material'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import auth from '../auth/authHelper'

export default function Navigation() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isActive = path => {
    if (pathname == path) return { color: '#ff4081' }
    else return { color: '#ffffff' }
  }
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" color="inherit" sx={{ mr: 5 }}>
          Social Media App
        </Typography>
        <Link to="/">
          <IconButton aria-label="Home" style={isActive('/')}>
            <Home />
          </IconButton>
        </Link>
        <Link to="/users">
          <Button style={isActive('/users')}>Users</Button>
        </Link>
        {!auth.isAuthenticated() && (
          <span>
            <Link to="/signup">
              <Button style={isActive('/signup')}> Sign Up </Button>
            </Link>
            <Link to="/signin">
              <Button style={isActive('/signin')}> Sign In </Button>
            </Link>
          </span>
        )}
        {auth.isAuthenticated() && (
          <span>
            <Link to={'/user/' + auth.isAuthenticated().user._id}>
              <Button style={isActive('/user/' + auth.isAuthenticated().user._id)}>
                My Profile
              </Button>
            </Link>
            <Button
              color="inherit"
              onClick={() => {
                auth.clearJWT(() => navigate('/'))
              }}
            >
              Sign out
            </Button>
          </span>
        )}
      </Toolbar>
    </AppBar>
  )
}
