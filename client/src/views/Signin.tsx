import { ChangeEvent, useState } from 'react'
import { signin } from '../auth/apiAuth'
import auth from '../auth/authHelper'
import { Navigate } from 'react-router'
import {
  Card,
  CardContent,
  Typography,
  TextField,
  CardActions,
  Button,
  Box,
  Alert
} from '@mui/material'

export default function Signin() {
  const [values, setValues] = useState({
    email: 'demo@gmail.com',
    password: 'Pass123',
    error: '',
    redirectToRefferer: false
  })

  const handleChange = (name: string) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [name]: event.target.value })
  }

  const clickSubmit = () => {
    const user = {
      email: values.email || undefined,
      password: values.password || undefined
    }
    signin(user).then(data => {
      if (data.error) {
        setValues({ ...values, error: data.error })
      } else {
        auth.authenticate(data, () => {
          setValues({ ...values, error: '', redirectToRefferer: true })
        })
      }
    })
  }

  const { redirectToRefferer } = values

  if (redirectToRefferer) {
    return <Navigate to="/" />
  }

  return (
    <div
      style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Card>
        <CardContent>
          <Typography variant="h6">Sign In</Typography>
          <TextField
            id="email"
            type="email"
            label="Email"
            value={values.email}
            margin="normal"
            onChange={handleChange('email')}
          />
          <br />
          <TextField
            id="password"
            type="password"
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
        <Box mt={2}>
          <Alert severity="info">
            <div>
              Use <b>demo@gmail.com</b>
              <br></br> and password <b>Pass123!</b>
            </div>
          </Alert>
        </Box>
      </Card>
    </div>
  )
}
