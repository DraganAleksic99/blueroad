import { baseUrl } from '../config/config'
import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
  CardActions,
  Divider,
  Box,
  styled
} from '@mui/material'
import {
  EmailOutlined as EmailIcon,
  PeopleOutlined as PeopleIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material'
import { TUser } from '../routes/Profile'

export const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4]
  }
}))

export const InfoRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}))

export default function UserCard({ user }: { user: TUser }) {
  const photoUrl = user.photo
    ? `${baseUrl}/api/users/photo/${user._id}`
    : `${baseUrl}/api/defaultPhoto`

  return (
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
      <CardContent sx={{ pb: 0, pl: '72px', pt: 0 }}>
        <InfoRow style={{ marginBottom: '16px' }}>
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
          <Typography variant="body2">
            <span style={{ fontWeight: 600 }}>{user.followers?.length}</span> followers
          </Typography>
        </InfoRow>
        <InfoRow>
          <PeopleIcon fontSize="small" />
          <Typography variant="body2">
            <span style={{ fontWeight: 600 }}>{user.following?.length}</span> following
          </Typography>
        </InfoRow>
      </CardActions>
    </StyledCard>
  )
}
