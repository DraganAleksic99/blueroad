import { baseUrl } from '../config/config'
import { useState, useEffect, SyntheticEvent } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  useMediaQuery,
  SwipeableDrawer,
  MenuItem,
  Dialog
} from '@mui/material'
import {
  Home as HomeIcon,
  People as UsersIcon,
  Person as ProfileIcon,
  Bookmark as BookmarkIcon,
  MoreHoriz as MoreHorizIcon,
  Settings as SettingsIcon,
  Close as CloseIcon
} from '@mui/icons-material'
import auth, { Session } from '../utils/utils'
import NewPost from '../views/post/NewPost'
import { createHandleFromEmail } from '../utils/utils'

export default function Navigation() {
  const { user }: Session = auth.isAuthenticated()
  const isMobile = useMediaQuery('(max-width:600px)')
  const [open, setOpen] = useState(false)

  const [isDialogOpen, setisDialogOpen] = useState(false)
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

  const closeDialog = () => {
    setisDialogOpen(false)
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
          <Link style={{ width: 'fit-content', display: 'inline-block' }} to="/">
            <Typography variant="h6" sx={{ p: 2, fontWeight: 'bold', color: 'rgb(33, 150, 243)' }}>
              Blueroad
            </Typography>
          </Link>
          <List>
            {navigationItems.map(item => (
              <NavLink key={item.url} to={item.url}>
                {({ isActive }) => (
                  <Box
                    sx={{
                      '&:hover .MuiListItemButton-root': {
                        backgroundColor: 'rgba(33, 150, 243, 0.1)'
                      }
                    }}
                  >
                    <ListItemButton
                      disableRipple
                      key={item.text}
                      sx={{
                        width: 'fit-content',
                        borderRadius: '40px',
                        pr: 3,
                        color: isActive ? 'rgb(33, 150, 243)' : '#000',
                        '& .MuiListItemIcon-root': {
                          color: isActive ? 'rgb(33, 150, 243)' : '#000'
                        }
                      }}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{
                          fontSize: {
                            lg: '1.2rem'
                          },
                          fontWeight: isActive ? '700' : '400'
                        }}
                        primary={item.text}
                      />
                    </ListItemButton>
                  </Box>
                )}
              </NavLink>
            ))}
            <Box
              sx={{
                '&:hover .MuiListItemButton-root': {
                  backgroundColor: 'rgba(33, 150, 243, 0.1)'
                }
              }}
            >
              <ListItemButton
                disableRipple
                sx={{
                  width: 'fit-content',
                  borderRadius: '40px',
                  pr: 3,
                  color: '#000',
                  '& .MuiListItemIcon-root': {
                    color: '#000'
                  }
                }}
              >
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{
                    fontSize: {
                      lg: '1.2rem'
                    },
                    fontWeight: 400
                  }}
                  primary="Settings"
                />
              </ListItemButton>
            </Box>
            <ListItem sx={{ pr: 6 }}>
              <Button
                disableRipple
                disableElevation
                variant="contained"
                sx={{
                  backgroundColor: 'rgb(33, 150, 243)',
                  borderRadius: '30px',
                  textTransform: 'none',
                  width: '100%',
                  height: '50px',
                  mt: 2,
                  px: 2,
                  fontSize: {
                    lg: '1.1rem'
                  },
                  fontWeight: 500
                }}
                onClick={() => setisDialogOpen(true)}
              >
                New post
              </Button>
            </ListItem>
          </List>
        </Box>
        <List>
          <ListItemButton
            disableRipple
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
              secondary={createHandleFromEmail(user.email)}
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
            <MenuItem
              onClick={() => {
                auth.clearJWT(() => navigate('/login'))
              }}
              sx={{ fontWeight: 500 }}
            >
              Log out {createHandleFromEmail(user.email)}
            </MenuItem>
          </Menu>
        </List>
      </Box>
      <Dialog
        PaperProps={{
          style: {
            width: '600px',
            borderRadius: '12px',
            position: 'absolute',
            top: 60,
            margin: 0
          }
        }}
        open={isDialogOpen}
        onClose={() => setisDialogOpen(false)}
      >
        <Box p={1} pb={0}>
        <IconButton
            sx={{
              color: 'rgb(33, 150, 243)',
              textTransform: 'none',
              fontWeight: 500,
              px: 1,
              borderRadius: '20px',
              '&:hover': {
                backgroundColor: 'rgba(33, 150, 243, 0.1)'
              }
            }}
            onClick={e => {
              e.preventDefault()
              setisDialogOpen(false)
            }}
          >
            <CloseIcon fontSize="medium" />
          </IconButton>
        </Box>
        <NewPost closeDialog={closeDialog} isDialogOpen={isDialogOpen} />
      </Dialog>
    </SwipeableDrawer>
  )
}
