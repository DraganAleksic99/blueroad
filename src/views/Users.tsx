import { useState, useEffect } from 'react'
import {
  Paper,
  Typography,
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  useTheme
} from '@mui/material'
import { Person, ArrowForward } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { list } from '../services/userService'
import MainLayout from '../layouts/MainLayout'

const baseUrl = 'https://social-media-app-e2ia.onrender.com'

export default function Users() {
  const theme = useTheme()
  const [users, setUsers] = useState([])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    list(signal).then(data => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        setUsers(data)
      }
    })
    // return function cleanup() {
    //   abortController.abort()
    // }
  }, [])

  return (
    <Paper elevation={4}>
      <MainLayout>
        <Typography variant="h5" sx={{ mb: theme.spacing(2) }}>
          All Users
        </Typography>
        <List dense>
          {users.map((user, i) => {
            return (
              <Link to={'/user/' + user._id} key={i}>
                <ListItemButton sx={{ mb: theme.spacing(1) }}>
                  <ListItemAvatar>
                    <Avatar
                      src={
                        user.photo?.data
                          ? `${baseUrl}/api/users/photo/${user._id}?${new Date().getTime()}`
                          : `${baseUrl}/api/defaultPhoto`
                      }
                    >
                      <Person />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={user.name} />
                  <ListItemSecondaryAction>
                    <IconButton>
                      <ArrowForward />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItemButton>
              </Link>
            )
          })}
        </List>
      </MainLayout>
    </Paper>
  )
}
