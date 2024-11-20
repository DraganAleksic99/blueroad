import { useState } from 'react'
import { create } from '../services/userService'
import {
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Paper,
  Container,
  Alert,
  Box,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import MainLayout from '../layouts/MainLayout'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { StyledPaper, StyledButton } from './Signin'
import { Link } from 'react-router-dom'

interface IFormValues {
  name: string
  email: string
  password: string
}

const schema = Yup.object({
  name: Yup.string().min(2).max(255).required(),
  email: Yup.string().email().max(255).required(),
  password: Yup.string().min(6).max(255).required()
}).required()

export default function Signup() {
  const [openDialog, setOpenDialog] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    // @ts-expect-error email or password can be undefined
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: IFormValues) => {
    setIsLoading(true)

    create(data).then(data => {
      if (data.error) {
        setError(data.error)
        setIsLoading(false)
      } else {
        setError("")
        setOpenDialog(true)
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
              Sign Up
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                margin="normal"
                type="text"
                {...register("name", {
                  required: "Name is required"
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
                FormHelperTextProps={{
                  sx: {
                    paddingTop: '8px'
                  }
                }}
                autoComplete="current-name"
                aria-label="Name input"
              />
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
                {isLoading ? 'Siging Up...' : 'Sign Up'}
              </StyledButton>
            </form>
          </StyledPaper>
          <Dialog open={openDialog}>
            <DialogTitle>New Account</DialogTitle>
            <DialogContent>
              <DialogContentText>New account successfully created</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Link to="/login">
                <Button sx={{ borderRadius: '20px', }} color="primary" autoFocus={true} variant="contained">
                  Log In
                </Button>
              </Link>
            </DialogActions>
          </Dialog>
        </Container>
      </MainLayout>
    </Paper>
  )
}
