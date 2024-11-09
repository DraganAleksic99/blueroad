import { useState, useEffect, ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  Paper,
  Avatar,
  TextField,
  Button,
  Stack,
  CardMedia,
  Box,
  IconButton,
  styled
} from '@mui/material'
import { ImageOutlined, Close } from '@mui/icons-material'
import auth, { Jwt } from '../../auth/authHelper'
import { TUser } from '../Profile'
import { TPost } from './NewsFeed'
import { createPost } from '../../services/postService'

const PostButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}))

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

const baseUrl = 'https://social-media-app-69re.onrender.com'

export default function NewPost({ addPost }: { addPost: (post: TPost) => void }) {
  const [values, setValues] = useState({
    text: '',
    photo: null
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [error, setError] = useState('')
  const [user, setUser] = useState<TUser | Record<string, unknown>>({})

  useEffect(() => {
    setUser(auth.isAuthenticated().user)
  }, [])

  const handleAddPost = () => {
    const jwt: Jwt = auth.isAuthenticated()
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
        setError(data.error)
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
    <Paper sx={{ p: 2, mb: "2px" }}>
      <Stack direction="row" spacing={2} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <Link to={`/user/${user._id}`}>
          <Avatar src={baseUrl + '/api/users/photo/' + user._id} />
        </Link>
        <TextField
          fullWidth
          multiline
          minRows={2}
          variant="outlined"
          placeholder="What's on your mind?"
          value={values.text}
          onChange={handleChange('text')}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              backgroundColor: 'action.hover'
            }
          }}
        />
      </Stack>
      {values.photo && (
        <Box sx={{ mb: 2, ml: '56px', position: 'relative' }}>
          <CardMedia
            component="img"
            height="400"
            image={imagePreview}
            alt="Post content"
            sx={{ objectFit: 'cover', border: '1px solid #2196F3', borderRadius: '12px' }}
          />
          <IconButton
            sx={{ position: 'absolute', top: '5px', right: '4px', color: 'black' }}
            aria-label="remove"
            onClick={() => setValues({ ...values, photo: null })}
          >
            <Close fontSize="medium" />
          </IconButton>
        </Box>
      )}
      <Stack sx={{ justifyContent: 'space-between' }} direction="row">
        <PostButton
          role={undefined}
          // @ts-expect-error required prop, ts doesn't recognize
          component="label"
          tabIndex={-1}
          sx={{ ml: '48px', py: 0 }}
          startIcon={<ImageOutlined />}
        >
          Photo
          <VisuallyHiddenInput
            type="file"
            onChange={e => {
              const file = e.target.files[0]
              if (file) {
                const reader = new FileReader()
                reader.onloadend = () => {
                  setImagePreview(reader.result)
                }
                reader.readAsDataURL(file)
              }
              handleChange('photo')(e)
            }}
          />
        </PostButton>
        <Button
          variant="outlined"
          size="small"
          sx={{
            borderRadius: '20px',
            textTransform: 'none',
            px: 2
          }}
          onClick={handleAddPost}
        >
          Post
        </Button>
      </Stack>
      {error}
    </Paper>
  )
}
