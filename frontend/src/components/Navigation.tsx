import { AppBar, Typography, IconButton, Button, Toolbar, styled } from '@mui/material'
import { Home, Person, Group } from '@mui/icons-material'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import auth from '../auth/authHelper'

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar)

export default function Navigation() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const isActive = (path: string) => {
    if (pathname == path) return { color: '#21CBF3' }
    else return { color: '#ffffff' }
  }
  return (
    <>
      <AppBar
        position="fixed"
        elevation={2}
        sx={{
          maxWidth: '1080px',
          left: 'auto',
          right: 'auto',
          backgroundColor: '#2196F3',
          boxShadow: 'none',
          paddingRight: '0px !important'
        }}
      >
        <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <Typography variant="h6" color="inherit">
              Social Media App
            </Typography>
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link to="/">
              <IconButton
                sx={{ borderRadius: '8px' }}
                size="small"
                aria-label="Home"
                style={isActive('/')}
              >
                <Home sx={{ padding: '1px', marginRight: '4px' }} />
                <div>Home</div>
              </IconButton>
            </Link>
            <Link to="/users">
              <IconButton sx={{ borderRadius: '8px' }} size="small" style={isActive('/users')}>
                <Group sx={{ padding: '1px', marginRight: '4px' }} />
                <div>Users</div>
              </IconButton>
            </Link>
            {auth.isAuthenticated() && (
              <span>
                <Link to={'/user/' + auth.isAuthenticated().user._id}>
                  <IconButton
                    sx={{ borderRadius: '8px' }}
                    size="small"
                    style={isActive('/user/' + auth.isAuthenticated().user._id)}
                  >
                    <Person sx={{ padding: '1px', marginRight: '4px' }} />
                    <div>Profile</div>
                  </IconButton>
                </Link>
              </span>
            )}
          </div>
          <div>
            {auth.isAuthenticated() && (
              <span>
                <Button
                  sx={{ borderRadius: '20px', textTransform: "none" }}
                  variant="contained"
                  onClick={() => {
                    auth.clearJWT(() => navigate('/login'))
                  }}
                >
                  Log out
                </Button>
              </span>
            )}
            {!auth.isAuthenticated() && (
              <span>
                <Link to="/signup">
                  <Button
                    sx={{ borderRadius: '20px', textTransform: "none" }}
                    variant="contained"
                    style={isActive('/signup')}
                  >
                    Sign up
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    variant="contained"
                    sx={{ marginLeft: '20px', borderRadius: '20px', textTransform: "none" }}
                    style={isActive('/login')}
                  >
                    Log in
                  </Button>
                </Link>
              </span>
            )}
          </div>
        </Toolbar>
      </AppBar>
      <Offset />
    </>
  )
}
