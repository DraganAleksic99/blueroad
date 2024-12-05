import { baseUrl } from '../config/config'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardMedia, Box, Typography, Button } from '@mui/material'
import { CalendarToday as CalendarIcon } from '@mui/icons-material'
import FollowProfileButton from './FollowProfileButton'
import auth, { Session } from '../auth/authHelper'
import { TUser } from '../routes/Profile'
import { TPost } from '../routes/NewsFeed'
import { TFollowCallbackFn } from './FollowProfileButton'

type Props = {
  user: TUser
  posts: TPost[]
  isFollowing: boolean
  isPending: boolean
  clickFollowButton: (callbackFn: TFollowCallbackFn) => Promise<void>
}

export default function ProfileCard({
  user,
  posts = [],
  isFollowing,
  isPending,
  clickFollowButton
}: Props) {
  const session: Session = auth.isAuthenticated()

  const photoUrl = user.photo
    ? `${baseUrl}/api/users/photo/${user._id}`
    : `${baseUrl}/api/defaultPhoto`

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 2 }}>
      <CardMedia
        component="img"
        sx={{ width: 150, height: 150, minWidth: 150, minHeight: 150, borderRadius: '50%' }}
        image={photoUrl}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1 1 auto' }}>
        <CardContent sx={{ p: 0, width: '100%' }}>
          <Typography sx={{ display: 'flex', justifyContent: 'space-between' }} component="div" variant="h5">
            {user.name}
            {session && session.user?._id === user._id ? (
              <Link to={`/user/edit/${user._id}`} state={user}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ px: 2, textTransform: 'none', borderRadius: '20px' }}
                >
                  Edit Profile
                </Button>
              </Link>
            ) : (
              <FollowProfileButton
                onButtonClick={clickFollowButton}
                isPending={isPending}
                following={isFollowing}
              />
            )}
          </Typography>
          <Typography variant="subtitle1" component="div" sx={{ color: 'text.secondary', mt: 1 }}>
            {user.email}
          </Typography>
          <Box sx={{ display: 'flex', gap: '30px', pt: 2 }}>
            <div>
              <Typography component="span" sx={{ mr: 1, fontWeight: 600 }}>
                {posts.length}
              </Typography>
              {posts.length === 1 ? 'post' : 'posts'}
            </div>
            <div>
              <Typography component="span" sx={{ mr: 1, fontWeight: 600 }}>
                {user?.followers?.length}
              </Typography>
              followers
            </div>
            <div>
              <Typography component="span" sx={{ mr: 1, fontWeight: 600 }}>
                {user?.following?.length}
              </Typography>
              following
            </div>
          </Box>
          <Typography sx={{ mt: 3 }} variant="body1">
            {user.about}
          </Typography>
          <Typography sx={{ display: 'flex', alignItems: 'center', pt: 2 }} variant="body2">
            <CalendarIcon sx={{ mr: 1 }} fontSize="small" />
            {'Joined: ' + new Date(user.created).toDateString()}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  )
}
