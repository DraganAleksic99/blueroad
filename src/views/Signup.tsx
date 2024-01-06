import { useState } from 'react'
import { create } from '../services/userService'
import {
  Card,
  CardContent,
  Typography,
  TextField,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material'
import { Link } from 'react-router-dom'

export default function Signup() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    open: false,
    error: ''
  })

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value })
  }

  const clickSubmit = () => {
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined
    }
    create(user).then(data => {
      if (data.error) {
        setValues({ ...values, error: data.error })
      } else {
        setValues({ ...values, error: '', open: true })
      }
    })
  }

  return (
    <div
      style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Card>
        <CardContent>
          <Typography variant="h6">Sign Up</Typography>
          <TextField
            id="name"
            label="Name"
            value={values.name}
            margin="normal"
            onChange={handleChange('name')}
          />
          <br />
          <TextField
            id="email"
            label="Email"
            value={values.email}
            margin="normal"
            onChange={handleChange('email')}
          />
          <br />
          <TextField
            id="password"
            label="Password"
            value={values.password}
            margin="normal"
            onChange={handleChange('password')}
          />
          <br />
          {values.error && (
            <Typography component="p" color="error">
              {values.error}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Button color="primary" variant="contained" onClick={clickSubmit}>
            Submit
          </Button>
        </CardActions>
      </Card>
      <Dialog open={values.open}>
        <DialogTitle>New Account</DialogTitle>
        <DialogContent>
          <DialogContentText>New account successfully created</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Link to="/signin">
            <Button color="primary" autoFocus={true} variant="contained">
              Sign In
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </div>
  )
}
