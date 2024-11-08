import { useState, useEffect, useMemo } from 'react'
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  Snackbar,
  Typography,
  Paper,
  Box
} from '@mui/material'
import { Link } from 'react-router-dom'
import { follow } from '../services/userService'
import auth, { Jwt } from '../auth/authHelper'
import { findPeople } from '../services/userService'
import { TUser } from './Profile'

const baseUrl = 'https://social-media-app-69re.onrender.com'

export default function FindPeople() {
  const [users, setUsers] = useState<TUser[] | []>([])
  const [values, setValues] = useState({
    open: false,
    followMessage: ''
  })

  const jwt: Jwt = useMemo(() => auth.isAuthenticated(), [])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    findPeople(
      {
        userId: jwt.user._id
      },
      {
        t: jwt.token
      },
      signal
    ).then(data => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        setUsers(data)
      }
    })

    return function cleanup() {
      abortController.abort()
    }
  }, [jwt])

  const handleFollow = (user: TUser, index: number) => {
    follow(
      {
        userId: jwt.user._id
      },
      {
        t: jwt.token
      },
      user._id
    ).then(data => {
      if (data.error) {
        console.log(data.error)
      } else {
        const toFollow = users
        toFollow.splice(index, 1)

        setValues({
          ...values,
          open: true,
          followMessage: `Following ${user.name}!`
        })
        setUsers(toFollow)
      }
    })
  }

  const handleClose = () => {
    setValues({
      ...values,
      open: false
    })
  }

  return (
    <Paper
      sx={{
        position: 'sticky',
        top: 8,
        maxHeight: 'calc(100vh - 8px)',
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '6px'
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent'
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#2196F3',
          borderRadius: '3px'
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#21CBF3'
        }
      }}
    >
      <Box>
        <Typography sx={{ fontWeight: '500', ml: 2, mb: 0, mt: 2 }} variant="h5" gutterBottom>
          Who to follow
        </Typography>
        <List>
          {users.map((user: TUser, index: number) => (
            <ListItem
              key={user._id}
              secondaryAction={
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    borderRadius: '20px',
                    textTransform: 'none',
                    px: 2
                  }}
                  onClick={() => handleFollow(user, index)}
                >
                  Follow
                </Button>
              }
            >
              <Link to={`/user/${user._id}`}>
                <ListItemAvatar>
                  <Avatar src={baseUrl + '/api/users/photo/' + user._id} alt={user.name} />
                </ListItemAvatar>
              </Link>
              <ListItemText
                primary={user.name}
                sx={{ maxWidth: "200px"}}
                primaryTypographyProps={{
                  fontWeight: 500,
                  variant: 'body1'
                }}
              />
            </ListItem>
          ))}
        </List>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          open={values.open}
          onClose={handleClose}
          autoHideDuration={6000}
          message={<span>{values.followMessage}</span>}
        />
      </Box>
    </Paper>
  )
}
