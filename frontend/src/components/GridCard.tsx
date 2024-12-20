import { baseUrl } from '../config/config'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Avatar, Card, CardHeader, Button, Typography, Box } from '@mui/material'
import { followUser, unfollowUser } from '../services/userService'
import { TUser } from '../routes/Profile'
import auth, { Session } from '../utils/utils'
import { TFollowCallbackFn } from './FollowProfileButton'
import { createHandleFromEmail } from '../utils/utils'

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
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    }
  })

  const handleButtonClick = (callbackFn: TFollowCallbackFn) => {
    mutate(callbackFn)
  }

  // @ts-expect-error todo: fix on backend
  const isFollower = user.following?.some(id => id === session.user?._id)

  return (
    <Link to={`/profile/${user._id}`}>
      <Card
        sx={{
          border: 'none',
          borderRadius: 0,
          boxShadow: 'none',
          '&:hover': { backgroundColor: 'rgb(246, 247, 248)' }
        }}
      >
        <CardHeader
          sx={{ alignItems: 'flex-start', py: '12px' }}
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
                onClick={e => {
                  e.preventDefault()
                  handleButtonClick(unfollowUser)
                }}
                data-following="Following"
                data-unfollow="Unfollow"
                sx={{
                  px: 2,
                  py: '4px',
                  textTransform: 'none',
                  borderRadius: '20px',
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  border: '1px solid rgb(33, 150, 243)',
                  color: 'rgb(33, 150, 243)',
                  '&::before': {
                    content: 'attr(data-following)'
                  },
                  '&:hover, &.Mui-disabled': {
                    px: '18.5px',
                    color: 'rgb(249, 24, 128)',
                    backgroundColor: 'rgba(249, 24, 128, 0.1)',
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
            ) : session.user._id === user._id ? null : (
              <Button
                size="small"
                disabled={isPending}
                onClick={e => {
                  e.preventDefault()
                  handleButtonClick(followUser)
                }}
                sx={{
                  px: 2,
                  py: '4px',
                  textTransform: 'none',
                  borderRadius: '20px',
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  border: '1px solid rgb(33, 150, 243)',
                  color: '#fff',
                  backgroundColor: 'rgb(33, 150, 243)'
                }}
              >
                {isFollower ? 'Follow back' : 'Follow'}
              </Button>
            )
          }
          title={
            <Typography className="text-underline" sx={{ fontWeight: 600, maxWidth: '200px' }}>
              {user.name}
            </Typography>
          }
          subheader={
            <div>
              <Typography component="span">{createHandleFromEmail(user.email)}</Typography>
              {isFollower && (
                <Box
                  sx={{
                    display: 'inline',
                    fontSize: '12px',
                    backgroundColor: '#6b7280',
                    color: '#d1d5db',
                    width: 'fit-content',
                    borderRadius: '4px',
                    px: '6px',
                    py: '2px',
                    ml: '4px'
                  }}
                >
                  Follows you
                </Box>
              )}
              <Typography variant="body2" color="#000" sx={{ pt: '4px', pr: 1 }}>
                {user.about}
              </Typography>
            </div>
          }
        />
      </Card>
    </Link>
  )
}
