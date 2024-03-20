import { useState } from 'react'
import auth from '../auth/authHelper'
import { remove } from '../services/userService'
import { Navigate } from 'react-router'
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material'
import { Delete } from '@mui/icons-material'

type Props = {
  userId: string
}

export default function DeleteUser({ userId }: Props) {
  const [open, setOpen] = useState(false)
  const [redirect, setRedirect] = useState(false)

  const clickButton = () => {
    setOpen(true)
  }

  const handleRequestClose = () => {
    setOpen(false)
  }

  const deleteAccount = () => {
    const jwt = auth.isAuthenticated()
    remove({ userId: userId }, { t: jwt.token }).then(data => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        auth.clearJWT(() => console.log('Deleted'))
        setRedirect(true)
      }
    })
  }

  if (redirect) {
    return <Navigate to="/" />
  }

  return (
    <span>
      <IconButton aria-label="Delete" onClick={clickButton} color="secondary">
        <Delete />
      </IconButton>
      <Dialog open={open} onClose={handleRequestClose}>
        <DialogTitle>{'Delete Account'}</DialogTitle>
        <DialogContent>
          <DialogContentText>Confirm to delete your account.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRequestClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteAccount} color="secondary" autoFocus={true}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  )
}
