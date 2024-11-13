import { baseUrl } from '../config/config'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardMedia, Box, Typography, Button } from '@mui/material'
import { CalendarToday as CalendarIcon } from '@mui/icons-material'
import FollowProfileButton from '../components/FollowProfileButton'
import auth, { Jwt } from '../auth/authHelper'
import { TUser } from '../views/Profile'
import { TPost } from '../views/post/NewsFeed'
import { TCallbackFn } from '../components/FollowProfileButton'

type Props = {
  user: TUser
  posts: TPost[]
  isFollowing: boolean
  isPending: boolean
  clickFollowButton: (callbackFn: TCallbackFn) => Promise<void>
}

export default function ProfileCard({
  user,
  posts = [],
  isFollowing,
  isPending,
  clickFollowButton
}: Props) {
  const session: Jwt = auth.isAuthenticated()

  const photoUrl = user.photo
    ? `${baseUrl}/api/users/photo/${user._id}`
    : `${baseUrl}/api/defaultPhoto`

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', gap: '50px', pb: 2 }}>
      <CardMedia
        component="img"
        sx={{ width: 150, height: 150, borderRadius: '50%', ml: '25%' }}
        image={photoUrl}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <CardContent sx={{ flex: '1 0 auto', pt: 3 }}>
          <Typography component="div" variant="h5">
            {user.name}
            {session && session.user?._id === user._id ? (
              <Link to={`/user/edit/${user._id}`} state={user}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ ml: 4, px: 2, textTransform: 'none', borderRadius: '20px' }}
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
