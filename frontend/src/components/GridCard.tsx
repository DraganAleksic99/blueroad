import { baseUrl } from '../config/config'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Avatar, Card, CardHeader, Button, Typography, Box } from '@mui/material'
import { followUser, unfollowUser } from '../services/userService'
import { TUser } from '../views/Profile'
import auth, { Session } from '../auth/authHelper'
import { TFollowCallbackFn } from './FollowProfileButton'

export default function GridCard({ user }: { user: TUser }) {
  const queryClient = useQueryClient()
  const session: Session = auth.isAuthenticated()
  const [isFollowing, setIsFollowing] = useState(
    // @ts-expect-error todo: fix on backend
    user.followers?.some(id => id === session.user._id)
  )

  const { mutate, isPending } = useMutation({
    mutationFn: (callbackFn: TFollowCallbackFn) => {
      return callbackFn(session.user._id, session.token, user._id)
    },
    onSuccess: () => {
      setIsFollowing(!isFollowing)
      queryClient.invalidateQueries({ queryKey: ["profile"]})
    }
  })

  const handleButtonClick = (callbackFn: TFollowCallbackFn) => {
    mutate(callbackFn)
  }

  // @ts-expect-error todo: fix on backend
  const isFollower = user.following?.some(id => id === session.user?._id)

  return (
    <Link to={`/user/${user._id}`}>
    <Card sx={{ height: '100%' }}>
      <CardHeader
        avatar={
          
            <Avatar
              src={baseUrl + '/api/users/photo/' + user._id}
              sx={{ margin: 'auto' }}
              alt={user.name}
            />
        }
        action={
          isFollowing ? (
            <Button
              variant="outlined"
              size="small"
              disabled={isPending}
              onClick={(e) => {
                e.preventDefault()
                handleButtonClick(unfollowUser)
              }}
              data-following="Following"
              data-unfollow="Unfollow"
              sx={{
                px: 2,
                textTransform: 'none',
                borderRadius: '20px',
                position: 'absolute',
                right: 16,
                top: 8,
                '&::before': {
                  content: 'attr(data-following)'
                },
                '&:hover, &.Mui-disabled': {
                  color: 'rgb(249, 24, 128)',
                  borderColor: 'rgb(249, 24, 128)',
                  '&::before': {
                    content: 'attr(data-unfollow)'
                  }
                },
                '&.Mui-disabled': {
                  opacity: 0.5,
                  pointerEvents: 'none'
                }
              }}
            />
          ) : (
            session.user._id === user._id ? null : (
              <Button
              variant="outlined"
              size="small"
              disabled={isPending}
              onClick={(e) => {
                e.preventDefault()
                handleButtonClick(followUser)
              }}
              sx={{
                px: 2,
                textTransform: 'none',
                borderRadius: '20px',
                position: 'absolute',
                right: 16,
                top: 8
              }}
            >
              Follow
            </Button>
            )
          )
        }
        title={<Typography sx={{ fontWeight: 600, maxWidth: '200px' }}>{user.name}</Typography>}
        subheader={
          <div>
            <Typography>{user.email}</Typography>
            {isFollower && (
              <Box
                sx={{
                  fontSize: '12px',
                  backgroundColor: '#636363',
                  color: '#afafaf',
                  width: 'fit-content',
                  borderRadius: '4px',
                  px: 1,
                  py: '1px',
                  mt: '2px'
                }}
              >
                Follows you
              </Box>
            )}
            <Typography variant="body2" color="#000" sx={{ pt: 1 }}>
              {user.about}
            </Typography>
          </div>
        }
      />
    </Card>
    </Link>
  )
}
