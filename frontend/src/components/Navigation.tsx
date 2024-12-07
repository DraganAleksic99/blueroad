import { baseUrl } from '../config/config'
import { useState, useEffect, SyntheticEvent } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  Menu,
  useMediaQuery,
  SwipeableDrawer,
  MenuItem
} from '@mui/material'
import {
  Home as HomeIcon,
  People as UsersIcon,
  Person as ProfileIcon,
  Bookmark as BookmarkIcon,
  MoreHoriz as MoreHorizIcon
} from '@mui/icons-material'
import auth, { Session } from '../auth/authHelper'

export default function Navigation() {
  const { user }: Session = auth.isAuthenticated()
  const isMobile = useMediaQuery('(max-width:600px)')
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const navigate = useNavigate()

  const navigationItems = [
    { text: 'Home', icon: <HomeIcon />, url: '/' },
    { text: 'Users', icon: <UsersIcon />, url: '/users' },
    { text: 'Profile', icon: <ProfileIcon />, url: `/profile/${user._id}` },
    { text: 'Bookmarks', icon: <BookmarkIcon />, url: '/bookmarks' }
  ]

  const toggleDrawer = (state: boolean) => () => {
    setOpen(state)
  }

  useEffect(() => {
    const handleSwipe = e => {
      if (e.type === 'touchstart') {
        if (e.touches[0].clientX < 30) setOpen(true)
      }
    }

    window.addEventListener('touchstart', handleSwipe)

    return () => window.removeEventListener('touchstart', handleSwipe)
  }, [])

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    setAnchorEl(event.currentTarget)
  }

  return (
    <SwipeableDrawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={open}
      onOpen={toggleDrawer(true)}
      onClose={toggleDrawer(false)}
      ModalProps={{
        keepMounted: true
      }}
      sx={{
        '& .MuiDrawer-paper': {
          width: isMobile ? 250 : '100%',
          position: 'relative',
          height: '100vh'
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          width: isMobile ? 250 : '100%'
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ p: 2, fontWeight: 'bold', color: 'rgb(33, 150, 243)' }}>
            Blueroad
          </Typography>
          <List>
            {navigationItems.map(item => (
              <NavLink key={item.url} to={item.url}>
                {({ isActive }) => (
                  <Box sx={{ '&:hover .MuiListItemButton-root': {backgroundColor: 'rgba(33, 150, 243, 0.1)' }}}>
                  <ListItemButton
                    key={item.text}
                    sx={{
                      width: 'fit-content',
                      borderRadius: '40px',
                      pr: 3,
                      color: isActive ? 'rgb(33, 150, 243)' : '#6b7280',
                      '& .MuiListItemIcon-root': {
                        color: isActive ? 'rgb(33, 150, 243)' : ''
                      }
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        fontSize: {
                          lg: '1.2rem'
                        },
                        fontWeight: 500
                      }}
                      primary={item.text}
                    />
                  </ListItemButton>
                  </Box>
                )}
              </NavLink>
            ))}
          </List>
        </Box>
        <List>
          <ListItemButton
            onClick={handleMenuOpen}
            sx={{
              borderRadius: '40px',
              marginRight: '8px',
              '&:hover': {
                backgroundColor: 'rgba(33, 150, 243, 0.1)'
              }
            }}
            key={user._id}
          >
            <ListItemAvatar>
              <Avatar src={baseUrl + '/api/users/photo/' + user._id} alt={user.name} />
            </ListItemAvatar>
            <ListItemText
              primary={user.name}
              secondary={`@${user.email}`}
              sx={{
                maxWidth: '145px',
                overflowX: 'hidden'
              }}
              primaryTypographyProps={{
                fontWeight: 500,
                variant: 'body1'
              }}
            />
            <ListItemIcon sx={{ justifyContent: 'flex-end', minWidth: 0 }}>
              <MoreHorizIcon />
            </ListItemIcon>
          </ListItemButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={(e: SyntheticEvent) => {
              e.preventDefault()
              setAnchorEl(null)
            }}
            disableScrollLock={true}
            transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            PaperProps={{
              sx: {
                borderRadius: '12px',
                minWidth: '200px',
                '& .MuiList-root': {
                  padding: '8px 0'
                }
              }
            }}
          >
            <MenuItem onClick={() => {
                    auth.clearJWT(() => navigate('/login'))
                  }} sx={{ fontWeight: 500 }}>Log out @{user.email}</MenuItem>
          </Menu>
        </List>
      </Box>
    </SwipeableDrawer>
  )
}
