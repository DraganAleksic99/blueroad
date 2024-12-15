import { baseUrl } from '../../config/config'
import { useState, ChangeEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
import auth, { Session } from '../../utils/utils'
import { TPost } from '../../routes/NewsFeed'
import { createPost } from '../../services/postService'

const ImageButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  color: theme.palette.text.secondary,
  alignItems: 'center',
  height: '34px',
  paddingInline: '12px',
  borderRadius: '30px',
  '& .MuiButton-startIcon': {
    color: '#2196F3'
  },
  '&:hover': {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    '&': {
      color: '#2196F3'
    }
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

const MAX_CHARS = 300

export default function NewPost({
  closeDialog,
  isDialogOpen
}: {
  closeDialog?: () => void
  isDialogOpen?: boolean
}) {
  const queryClient = useQueryClient()
  const [imagePreview, setImagePreview] = useState(null)
  const { user, token }: Session = auth.isAuthenticated()

  const [values, setValues] = useState({
    text: '',
    photo: null
  })
  const progress = (values.text.length / MAX_CHARS) * 100

  const addPostMutation = useMutation({
    mutationFn: async (postData: FormData) => {
      return createPost(user._id, token, postData)
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['newsfeed', user, token] })

      const previousPosts: TPost[] = queryClient.getQueryData(['newsfeed', user, token])

      queryClient.setQueryData(['newsfeed', user, token], (oldPosts: TPost[]) => {
        return [
          {
            text: values.text,
            postedBy: {
              _id: user._id,
              name: user.name,
              email: user.email
            },
            created: new Date(),
            likes: [],
            comments: [],
            imagePreview
          },
          ...oldPosts
        ]
      })

      return { previousPosts }
    },
    onError: (_err, _newPost, context) => {
      queryClient.setQueryData(['newsfeed', user, token], context.previousPosts)
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['newsfeed'],
        refetchType: 'active'
      })

      queryClient.invalidateQueries({
        queryKey: ['posts'],
        refetchType: 'all'
      })
    }
  })

  const handleAddPost = () => {
    const postData = new FormData()

    values.text && postData.append('text', values.text)
    values.photo && postData.append('photo', values.photo)

    addPostMutation.mutate(postData)

    if (isDialogOpen) {
      closeDialog()
    }

    setValues({ ...values, text: '', photo: null })
  }

  const handleChange = (name: string) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = name === 'photo' ? event.target.files[0] : event.target.value
    setValues({ ...values, [name]: value })
  }

  return (
    <Paper elevation={0} sx={{ p: 2, pb: 1, borderRadius: 0, borderBottom: '1px solid #e5e7eb' }}>
      <Stack direction="row" spacing={2} sx={{ display: 'flex', alignItems: 'flex-start' }}>
        <Link to={`/user/${user._id}`}>
          <Avatar src={baseUrl + '/api/users/photo/' + user._id} />
        </Link>
        <TextField
          fullWidth
          multiline
          minRows={isDialogOpen ? 4 : 2}
          variant="outlined"
          placeholder="What's on your mind?"
          value={values.text}
          onChange={handleChange('text')}
          sx={{
            '& .MuiOutlinedInput-root': {
              fontSize: '1.2rem',
              p: 0,
              pb: '12px',
              '& fieldset': {
                borderColor: 'transparent'
              },
              '&:hover fieldset': {
                borderColor: 'transparent'
              },
              '&.Mui-focused fieldset': {
                borderColor: 'transparent'
              }
            }
          }}
          inputMode="text"
          inputProps={{ maxLength: MAX_CHARS }}
        />
      </Stack>
      {values.photo && (
        <Box sx={{ mb: 1, ml: '56px', position: 'relative' }}>
          <CardMedia
            component="img"
            height="400"
            image={imagePreview}
            alt="Post content"
            sx={{ objectFit: 'cover', border: '1px solid #e5e7eb', borderRadius: '12px' }}
          />
          <IconButton
            sx={{
              position: 'absolute',
              top: '5px',
              right: '4px',
              color: 'rgb(33, 150, 243)',
              '&:hover': {
                backgroundColor: 'rgba(33, 150, 243, 0.1)'
              }
            }}
            aria-label="remove"
            onClick={() => setValues({ ...values, photo: null })}
          >
            <Close fontSize="medium" />
          </IconButton>
        </Box>
      )}
      <Box ml={ isDialogOpen ? 0 : '56px'} mb={1} borderBottom="1px solid #e5e7eb"></Box>
      <Stack sx={{ justifyContent: 'space-between' }} direction="row">
        <ImageButton sx={{ ml: isDialogOpen ? '-10px' : '44px' }} role={undefined} tabIndex={-1} startIcon={<ImageOutlined />}>
          <Box display="flex" alignItems="center" pt="2px">
            Photo
          </Box>
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
        </ImageButton>
        <Box display="flex">
          <Box display="flex" alignItems="center">
            <Box sx={{ mr: 2 }}>{MAX_CHARS - values.text.length}</Box>
            <svg style={{ height: '25px', width: '25px', marginRight: '16px' }} viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="none" stroke="#e5e7eb" strokeWidth="2" />
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="rgb(33, 150, 243)"
                strokeWidth="2"
                strokeDasharray="62.83185307179586"
                strokeDashoffset={62.83185307179586 - (progress / 100) * 62.83185307179586}
                transform="rotate(-90 12 12)"
              />
            </svg>
          </Box>
          <Button
            disableRipple
            disabled={!values.text.trim()}
            size="small"
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
              px: 2,
              backgroundColor: 'rgb(33, 150, 243)',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '15px',
              '&.Mui-disabled': {
                backgroundColor: 'rgba(33, 150, 243, 0.5)',
                color: 'rgba(255, 255, 255, 0.8)'
              }
            }}
            onClick={handleAddPost}
          >
            Post
          </Button>
        </Box>
      </Stack>
    </Paper>
  )
}
