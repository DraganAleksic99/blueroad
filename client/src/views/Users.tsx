import { useState, useEffect } from 'react'
import { Paper } from '@mui/material'
import { list } from '../services/userService'
import MainLayout from '../layouts/MainLayout'
import { Link } from 'react-router-dom'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Box,
  Divider,
  styled
} from '@mui/material'
import {
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  People as PeopleIcon
} from '@mui/icons-material'
import { TUser } from '../views/Profile'

const baseUrl = 'https://social-media-app-69re.onrender.com'

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4]
  }
}))

const InfoRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}))

export default function Users() {
  const [users, setUsers] = useState<TUser[]>([])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    list(signal).then(data => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        setUsers(data)
      }
    })

    return () => abortController.abort()
  }, [])

  return (
    <Paper elevation={2}>
      <MainLayout>
        <Box sx={{ p: 3, pt: 0, columnCount: 3 }}>
          {users.map(user => {
            const photoUrl = user.photo
              ? `${baseUrl}/api/users/photo/${user._id}?${new Date().getTime()}`
              : `${baseUrl}/api/defaultPhoto`

            return (
              <Link
                to={`/user/${user._id}`}
                key={user._id}
                style={{ display: 'inline-block', width: '100%', marginTop: '24px' }}
              >
                <StyledCard>
                  <CardHeader
                    sx={{ pb: 0 }}
                    avatar={<Avatar src={photoUrl}>{user.name.charAt(0)}</Avatar>}
                    title={
                      <Typography variant="h6" component="h2">
                        {user.name}
                      </Typography>
                    }
                    subheader={
                      <InfoRow>
                        <EmailIcon fontSize="small" />
                        <Typography variant="body2">{user.email}</Typography>
                      </InfoRow>
                    }
                  />
                  <CardContent sx={{ pb: 0, pl: "72px", pt: 0 }}>
                    
                    <InfoRow style={{ marginBottom: "16px"}}>
                      <CalendarIcon fontSize="small" />
                      <Typography variant="body2">
                        {'Joined: ' + new Date(user.created).toDateString()}
                      </Typography>
                    </InfoRow>
                    {user.about && (
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {user.about}
                      </Typography>
                    )}
                  </CardContent>
                  <Divider />
                  <CardActions sx={{ justifyContent: 'space-between', px: 2, pt: 2 }}>
                    <InfoRow>
                      <PeopleIcon fontSize="small" />
                      <Typography variant="body2"><span style={{ fontWeight: 600 }}>{user.followers?.length}</span> followers</Typography>
                    </InfoRow>
                    <InfoRow>
                      <PeopleIcon fontSize="small" />
                      <Typography variant="body2"><span style={{ fontWeight: 600 }}>{user.following?.length}</span> following</Typography>
                    </InfoRow>
                  </CardActions>
                </StyledCard>
              </Link>
            )
          })}
        </Box>
      </MainLayout>
    </Paper>
  )
}
