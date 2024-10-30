import { useState } from 'react'
import { signin } from '../auth/apiAuth'
import auth from '../auth/authHelper'
import { Navigate } from 'react-router'
import {
  Typography,
  TextField,
  Button,
  CircularProgress,
  Box,
  Alert,
  Paper,
  Container,
  InputAdornment,
  IconButton,
  styled
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import MainLayout from '../layouts/MainLayout'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

const StyledPaper = styled(Paper)({
  padding: '2rem',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)'
})

const StyledButton = styled(Button)({
  marginTop: '1.5rem',
  padding: '0.75rem 2rem',
  borderRadius: '8px',
  fontSize: '1.1rem',
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
})

interface IFormValues {
  email: string
  password: string
}

const schema = Yup.object({
  email: Yup.string().email().max(255).required(),
  password: Yup.string().min(6).max(255).required()
}).required()

export default function Signin() {
  const [redirect, setRedirect] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IFormValues>({
    defaultValues: {
      email: 'demo@gmail.com',
      password: 'Pass123'
    },
    // @ts-expect-error email or password can be undefined
    resolver: yupResolver(schema)
  })

  if (redirect) {
    return <Navigate to="/" />
  }

  const onSubmit = (data: IFormValues) => {
    setIsLoading(true)

    signin(data).then(data => {
      if (data.error) {
        setError(data.error)
        setIsLoading(false)
      } else {
        auth.authenticate(data, () => {
          setRedirect(true)
          setError('')
        })
        setIsLoading(false)
      }
    })
  }

  return (
    <Paper
      sx={{
        backgroundImage: 'url("/blue-abstract-background.jpg")',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        borderRadius: '0px'
      }}
    >
      <MainLayout>
        <Container
          maxWidth="sm"
          sx={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center' }}
        >
          <StyledPaper elevation={3}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                textAlign: 'center',
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}
            >
              Log In
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
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
              />
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                margin="normal"
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
              {error && (
                <Box mt={2} sx={{ paddingBlock: '0px' }}>
                  <Alert
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingBlock: '0px'
                    }}
                    severity="error"
                  >
                    <p style={{ marginBlock: '6px' }}>{error}</p>
                  </Alert>
                </Box>
              )}
              <StyledButton
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading}
                endIcon={isLoading && <CircularProgress size={20} color="inherit" />}
              >
                {isLoading ? 'Loging In...' : 'Log In'}
              </StyledButton>
            </form>
            <Box mt={2}>
              <Alert style={{ display: 'flex', justifyContent: 'center' }} severity="info">
                <div>
                  Use <b>demo@gmail.com</b> and password <b>Pass123!</b>
                </div>
              </Alert>
            </Box>
          </StyledPaper>
        </Container>
      </MainLayout>
    </Paper>
  )
}
