import { useState, useEffect } from 'react'
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Button,
  IconButton,
  Snackbar,
  Typography
} from '@mui/material'
import { Visibility as VisibilityIcon } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { follow } from '../services/userService'
import auth from '../auth/authHelper'
import { findPeople } from '../services/userService'

const baseUrl = 'http://localhost:3500'

export default function FindPeople() {
  const [users, setUsers] = useState([])
  const [values, setValues] = useState({
    open: false,
    followMessage: ''
  })
  const jwt = auth.isAuthenticated()

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
    // return function cleanup() {
    //   abortController.abort()
    // }
  }, [jwt])

  const handleFollow = (user, index) => {
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
        console.log(toFollow)

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
    <List>
      <Typography variant="h6">Who to follow</Typography>
      {users.map((item, i) => {
        return (
          <span key={i}>
            <ListItem>
              <ListItemAvatar>
                <Avatar src={baseUrl + '/api/users/photo/' + item._id} />
              </ListItemAvatar>
              <ListItemText primary={item.name} />
              <ListItemSecondaryAction>
                <Link to={'/user/' + item._id}>
                  <IconButton color="secondary">
                    <VisibilityIcon />
                  </IconButton>
                </Link>
                <Button
                  aria-label="Follow"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    handleFollow(item, i)
                  }}
                >
                  Follow
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          </span>
        )
      })}
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
    </List>
  )
}
