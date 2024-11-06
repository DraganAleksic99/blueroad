import { useState, useEffect, useMemo } from 'react'
import { Link, useMatch, Navigate } from 'react-router-dom'
import { read } from '../services/userService'
import { loadPosts } from '../services/postService'
import auth, { Jwt } from '../auth/authHelper'
import MainLayout from '../layouts/MainLayout'
import { Paper, Card, CardContent, CardMedia, Box, Typography, Button } from '@mui/material'
import { CalendarToday as CalendarIcon } from '@mui/icons-material'
import FollowProfileButton from '../components/FollowProfileButton'
import ProfileTabs from './ProfileTabs'
import { TPost } from './post/NewsFeed'
import { TCallbackFn } from '../components/FollowProfileButton'

const baseUrl = 'https://social-media-app-69re.onrender.com'

export type TUser = {
  _id: string
  name: string
  email: string
  password: string
  about: string
  created: number
  photo: {
    data: Buffer
  }
  following: TUser[]
  followers: TUser[]
}

export default function Profile() {
  const match = useMatch('/user/:userId')
  const [user, setUser] = useState<TUser | Record<string, never>>({})
  const [posts, setPosts] = useState<TPost[]>([])
  const [isFollowing, setIsFollowing] = useState(false)

  const session: Jwt = useMemo(() => auth.isAuthenticated(), [])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    read({ userId: match.params.userId }, { t: session.token }, signal).then(data => {
      if (data && data.error) {
        return <Navigate to="/signin" />
      } else {
        const following = checkFollow(data, session)
        setUser(data)
        setIsFollowing(following)
      }
    })

    return function cleanup() {
      abortController.abort()
    }
  }, [match.params.userId, session])

  useEffect(() => {
    loadPosts({ userId: user._id }, { t: session.token }).then(data => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        setPosts(data)
      }
    })
  }, [user, session])

  const checkFollow = (user: TUser, session: Jwt) => {
    const match = user.followers.some(follower => follower._id == session.user._id)
    return match
  }

  const clickFollowButton = (callApi: TCallbackFn, session: Jwt) => {
    callApi({ userId: session.user._id }, { t: session.token }, user._id).then(data => {
      if (data.error) {
        console.log(data.error)
      } else {
        setUser(data)
        setIsFollowing(!isFollowing)
      }
    })
  }

  const removePost = (post: TPost) => {
    const updatedPosts = [...posts]
    const index = updatedPosts.indexOf(post)
    updatedPosts.splice(index, 1)
    setPosts(updatedPosts)
  }

  const photoUrl = user.photo
    ? `${baseUrl}/api/users/photo/${user._id}?${new Date().getTime()}`
    : `${baseUrl}/api/defaultPhoto`

  return (
    <Paper elevation={4}>
      <MainLayout>
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
                {session && session.user._id === user._id ? (
                  <Link to={`/user/edit/${user._id}`} state={user}>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ ml: 4, textTransform: 'none', borderRadius: '8px' }}
                    >
                      Edit Profile
                    </Button>
                  </Link>
                ) : (
                  <FollowProfileButton onButtonClick={clickFollowButton} following={isFollowing} />
                )}
              </Typography>
              <Typography
                variant="subtitle1"
                component="div"
                sx={{ color: 'text.secondary', mt: 1 }}
              >
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
                    {user.followers?.length}
                  </Typography>
                  followers
                </div>
                <div>
                  <Typography component="span" sx={{ mr: 1, fontWeight: 600 }}>
                    {user.following?.length}
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
        <ProfileTabs onRemove={removePost} posts={posts} user={user} />
      </MainLayout>
    </Paper>
  )
}
