import { useState } from 'react'
import { useMatch, Navigate, useLocation, useNavigate } from 'react-router'
import auth from '../auth/authHelper'
import { update } from '../services/userService'
import {
  Card,
  CardContent,
  Typography,
  TextField,
  CardActions,
  Button,
  Avatar
} from '@mui/material'
import { Person } from '@mui/icons-material'

const baseUrl = 'http://localhost:3500'

export default function EditProfile() {
  const match = useMatch('/user/edit/:userId')
  const user = useLocation().state
  const navigate = useNavigate()

  const [values, setValues] = useState({
    name: user?.name || '',
    about: user?.about || '',
    photo: null,
    email: user?.email || '',
    password: '',
    error: '',
    userId: '',
    redirectToProfile: false
  })

  const handleChange = name => event => {
    const value = name === 'photo' ? event.target.files[0] : event.target.value
    setValues({ ...values, [name]: value })
  }

  const clickSubmit = () => {
    const jwt = auth.isAuthenticated()
    const userData = new FormData()
    values.name && userData.append('name', values.name)
    values.email && userData.append('email', values.email)
    values.password && userData.append('password', values.password)
    values.about && userData.append('about', values.about)
    values.photo && userData.append('photo', values.photo)

    update({ userId: match.params.userId }, { t: jwt.token }, userData).then(data => {
      if (data && data.error) {
        setValues({ ...values, error: data.error })
      } else {
        setValues({ ...values, userId: data._id, redirectToProfile: true })
      }
    })
  }

  if (values.redirectToProfile) {
    return <Navigate to={`/user/${values.userId}`} />
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card>
        <CardContent>
          <Typography variant="h6">Edit Profile</Typography>
          <Avatar
            src={
              user.photo?.data
                ? `${baseUrl}/api/users/photo/${user._id}?${new Date().getTime()}`
                : `${baseUrl}/api/defaultPhoto`
            }
          >
            <Person />
          </Avatar>
          <div>
            <input
              accept="image/*"
              type="file"
              onChange={handleChange('photo')}
              style={{ display: 'none' }}
              id="icon-button-file"
            />
            <label htmlFor="icon-button-file">
              <Button variant="contained" color="primary" component="span">
                Upload
              </Button>
            </label>
            <span>{values.photo ? values.photo.name : ''}</span>
          </div>
          <TextField
            id="name"
            label="Name"
            value={values.name}
            margin="normal"
            onChange={handleChange('name')}
          />
          <br />
          <TextField
            id="multiline-flexible"
            label="About"
            multiline
            value={values.about}
            margin="normal"
            onChange={handleChange('about')}
            minRows="2"
          />
          <br />
          <TextField
            id="email"
            label="Email"
            type="email"
            value={values.email}
            margin="normal"
            onChange={handleChange('email')}
          />
          <br />
          <TextField
            id="password"
            label="Password"
            type="password"
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
            Save
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={() => navigate(`/user/${match.params.userId}`)}
          >
            Cancel
          </Button>
        </CardActions>
      </Card>
    </div>
  )
}
