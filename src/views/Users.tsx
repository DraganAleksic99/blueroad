import { useState, useEffect } from 'react'
import { list } from '../services/userService'
import {
  Paper,
  Typography,
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from '@mui/material'
import { Person, ArrowForward } from '@mui/icons-material'
import { Link } from 'react-router-dom'

const baseUrl = 'http://localhost:3500'

export default function Users() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    list(signal).then(data => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        setUsers(data)
        console.log(data)
      }
    })
    // return function cleanup() {
    //   abortController.abort()
    // }
  }, [])

  return (
    <Paper elevation={4}>
      <Typography variant="h6">All Users</Typography>
      <List dense>
        {users.map((user, i) => {
          return (
            <Link to={'/user/' + user._id} key={i}>
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar
                    src={
                      user.photo?.data
                        ? `${baseUrl}/api/users/photo/${user._id}?${new Date().getTime()}`
                        : `${baseUrl}/api/users/defaultPhoto`
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
    </Paper>
  )
}
