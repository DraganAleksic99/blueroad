import { baseUrl } from '../config/config'
import { ChangeEvent, useState } from 'react'
import { useMatch, useLocation, useNavigate } from 'react-router'
import auth, { Session } from '../auth/authHelper'
import { update } from '../services/userService'
import {
  Card,
  CardContent,
  Typography,
  TextField,
  CardActions,
  Button,
  Avatar,
  InputAdornment,
  IconButton,
  useTheme
} from '@mui/material'
import {
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { TUser } from './Profile'

interface IFormValues {
  name: string
  about: string
  email: string
  password: string
  photo: File
}

const schema = Yup.object({
  name: Yup.string().min(2).max(255).required(),
  about: Yup.string().max(150),
  email: Yup.string().email().max(255).required(),
  password: Yup.string().min(6).max(255).required().test(
    'current-password', 
    'Incorrect password. Enter your current password', 
    (value) => value === 'Pass123'
  ),
}).required()

export default function EditProfile() {
  const theme = useTheme()
  const match = useMatch('/user/edit/:userId')
  const user: TUser = useLocation().state
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IFormValues>({
    defaultValues: {
      name: user.name,
      about: user.about || '',
      email: user.email,
      password: ''
    },
    // @ts-expect-error email or password can be undefined
    resolver: yupResolver(schema)
  })

  const onSubmit: SubmitHandler<IFormValues> = data => {
    const session: Session = auth.isAuthenticated()
    const formData = new FormData()

    formData.append('photo', data.photo[0])

    for (const [k, v] of Object.entries(data)) {
      if (k === 'photo') continue
      formData.append(k, v)
    }

    setIsLoading(true)

    update(match.params.userId, session.token, formData).then(data => {
      if (data && data.error) {
        setError(data.error)
        setIsLoading(false)
      } else {
        setIsLoading(false)
        navigate(`/profile/${data._id}`)
      }
    })
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ width: '100%' }}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <CardContent sx={{ maxWidth: '700px', margin: 'auto' }}>
            <Typography variant="h6" sx={{ my: theme.spacing(3), mb: '32px' }}>
              Edit Profile
            </Typography>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBlockEnd: theme.spacing(3),
                padding: '16px',
                borderRadius: '20px',
                backgroundColor: 'rgba(239, 239, 239)'
              }}
            >
              <Avatar
                component="div"
                src={
                  imagePreview ||
                  (user.photo
                    ? `${baseUrl}/api/users/photo/${user._id}?${new Date().getTime()}`
                    : `${baseUrl}/api/defaultPhoto`)
                }
                sx={{ height: '56px', width: '56px' }}
              >
                <PersonIcon />
              </Avatar>
              <div>
                <input
                  accept="image/*"
                  type="file"
                  onChangeCapture={(e: ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        setImagePreview(reader.result)
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                  {...register('photo')}
                  style={{ display: 'none' }}
                  id="icon-button-file"
                />
                <label htmlFor="icon-button-file">
                  <Button
                    variant="outlined"
                    color="primary"
                    component="span"
                    sx={{ borderRadius: '20px', textTransform: 'none' }}
                  >
                    Change photo
                  </Button>
                </label>
              </div>
            </div>
            <TextField
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px',
                  '& fieldset': {
                    borderColor: 'rgba(219, 219, 219)'
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(219, 219, 219)'
                  }
                }
              }}
              id="name"
              label="Name"
              type="text"
              {...register('name', {
                required: 'Name is required'
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
              FormHelperTextProps={{
                sx: {
                  paddingTop: '8px'
                }
              }}
              autoComplete="about"
              aria-label="About input"
              margin="normal"
            />
            <br />
            <TextField
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px',
                  '& fieldset': {
                    borderColor: 'rgba(219, 219, 219)'
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(219, 219, 219)'
                  }
                }
              }}
              id="multiline-flexible"
              label="About"
              multiline
              minRows="2"
              type="text"
              {...register('about')}
              error={!!errors.about}
              helperText={errors.about?.message}
              FormHelperTextProps={{
                sx: {
                  paddingTop: '8px'
                }
              }}
              autoComplete="about"
              aria-label="About input"
              margin="normal"
            />
            <br />
            <TextField
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px',
                  '& fieldset': {
                    borderColor: 'rgba(219, 219, 219)'
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(219, 219, 219)'
                  }
                }
              }}
              id="email"
              label="Email"
              type="email"
              {...register('email', {
                required: 'Email is required'
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              FormHelperTextProps={{
                sx: {
                  paddingTop: '8px'
                }
              }}
              autoComplete="email"
              aria-label="Email input"
              margin="normal"
            />
            <br />
            <TextField
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px',
                  '& fieldset': {
                    borderColor: 'rgba(219, 219, 219)'
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(219, 219, 219)'
                  }
                }
              }}
              id="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: 'Password is required'
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              FormHelperTextProps={{
                sx: {
                  paddingTop: '8px'
                }
              }}
              autoComplete="current-password"
              aria-label="Password input"
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <br />
            {error && (
              <Typography component="p" color="error">
                {error}
              </Typography>
            )}
          </CardContent>
          <CardActions
            sx={{
              ml: theme.spacing(1),
              pb: 2,
              pl: theme.spacing(2),
              maxWidth: '700px',
              margin: 'auto'
            }}
          >
            <Button
              type="submit"
              color="primary"
              variant="outlined"
              sx={{ borderRadius: '20px', mr: 2, px: 3, textTransform: 'none' }}
              disabled={isLoading}
            >
              Save
            </Button>
            <Button
              color="primary"
              variant="outlined"
              sx={{ borderRadius: '20px', px: 3, textTransform: 'none' }}
              onClick={() => navigate(`/profile/${match.params.userId}`)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </CardActions>
        </form>
      </Card>
    </div>
  )
}
