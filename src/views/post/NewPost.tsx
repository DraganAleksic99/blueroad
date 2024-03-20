import { useState, useEffect, ChangeEvent } from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  TextField,
  Typography,
  Avatar,
  Icon,
  IconButton,
  useTheme
} from '@mui/material'
import { PhotoCamera } from '@mui/icons-material'
import { createPost } from '../../services/postService'
import auth from '../../auth/authHelper'
import { TUser } from '../Profile'

const baseUrl = 'https://social-media-app-backend-production-679e.up.railway.app'

export default function NewPost({ addPost }) {
  const theme = useTheme()
  const [values, setValues] = useState({
    text: '',
    photo: null,
    error: ''
  })
  const [user, setUser] = useState<TUser | Record<string, never>>({})
  const jwt = auth.isAuthenticated()

  useEffect(() => {
    setUser(auth.isAuthenticated().user)
  }, [])

  const clickPost = () => {
    const postData = new FormData()
    values.text && postData.append('text', values.text)
    values.photo && postData.append('photo', values.photo)

    createPost(
      {
        userId: jwt.user._id
      },
      {
        t: jwt.token
      },
      postData
    ).then(data => {
      if (data.error) {
        setValues({ ...values, error: data.error })
      } else {
        setValues({ ...values, text: '', photo: null })
        addPost(data)
      }
    })
  }

  const handleChange = (name: string) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = name === 'photo' ? event.target.files[0] : event.target.value
    setValues({ ...values, [name]: value })
  }

  return (
    <div>
      <Card>
        <CardHeader
          sx={{ paddingBlockEnd: 0 }}
          avatar={<Avatar src={baseUrl + '/api/users/photo/' + user._id} />}
          title={user.name}
        />
        <CardContent sx={{ ml: theme.spacing(7), paddingBlockStart: 0 }}>
          <TextField
            placeholder="Share your thoughts ..."
            multiline
            rows="3"
            value={values.text}
            onChange={handleChange('text')}
            margin="normal"
          />
          <input
            accept="image/*"
            onChange={handleChange('photo')}
            id="icon-button-file"
            type="file"
            style={{ display: 'none' }}
          />
          <label htmlFor="icon-button-file">
            <IconButton
              color="secondary"
              component="span"
              sx={{ marginInlineStart: theme.spacing(2) }}
            >
              <PhotoCamera />
            </IconButton>
          </label>{' '}
          <span>{values.photo ? values.photo.name : ''}</span>
          {values.error && (
            <Typography component="p" color="error">
              <Icon color="error">error</Icon>
              {values.error}
            </Typography>
          )}
        </CardContent>
        <CardActions sx={{ ml: theme.spacing(7), pl: theme.spacing(2), mb: theme.spacing(1) }}>
          <Button
            color="primary"
            variant="contained"
            disabled={values.text === ''}
            onClick={clickPost}
          >
            POST
          </Button>
        </CardActions>
      </Card>
    </div>
  )
}
