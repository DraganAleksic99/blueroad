import { baseUrl } from '../config/config'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  Snackbar,
  Typography,
  Paper,
  Box,
  Skeleton,
  styled
} from '@mui/material'
import { followUser, getUsersToFollow } from '../services/userService'
import auth, { Session } from '../auth/authHelper'
import { createHandleFromEmail } from '../utils/utils'
import { TUser } from '../routes/Profile'

const WhoToFollowPaper = styled(Paper)({
  borderRadius: 0,
  borderLeft: '1px solid #e5e7eb',
  borderRight: '1px solid #e5e7eb',
  maxHeight: '100vh',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '6px'
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent'
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#2196F3',
    borderRadius: '3px'
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#21CBF3'
  }
})

const usersToFollowQuery = (userId: string, token: string) => ({
  queryKey: ['usersToFollow', userId, token],
  queryFn: async () => getUsersToFollow(userId, token)
})

export default function FindPeople() {
  const { user, token }: Session = auth.isAuthenticated()
  const { data, isPending } = useQuery(usersToFollowQuery(user._id, token))

  const queryClient = useQueryClient()
  const [followedUserName, setFollowedUserName] = useState('')
  const [snackbarInfo, setSnackbarInfo] = useState({
    open: false,
    message: ''
  })

  const { mutate } = useMutation({
    mutationFn: (userToFollow: TUser) => {
      return followUser(user._id, token, userToFollow._id)
    },
    onMutate: async userToFollow => {
      await queryClient.cancelQueries({ queryKey: ['usersToFollow', user._id, token] })

      const previousData: TUser[] = queryClient.getQueryData(['usersToFollow', user._id, token])

      queryClient.setQueryData(['usersToFollow', user._id, token], (oldUsers: TUser[]) => {
        return [...oldUsers.filter(oldUser => oldUser._id !== userToFollow._id)]
      })

      return { previousData }
    },
    onError: (_err, _newPost, context) => {
      queryClient.setQueryData(['usersToFollow', user._id, token], context.previousData)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['usersToFollow', user._id, token] })
    },
    onSuccess: () => {
      setSnackbarInfo({
        open: true,
        message: `You followed ${followedUserName}`
      })
    }
  })

  const handleFollow = (userToFollow: TUser) => {
    setFollowedUserName(userToFollow.name)
    mutate(userToFollow)
  }

  if (isPending) {
    return (
      <WhoToFollowPaper elevation={0}>
        <Box>
          <Typography sx={{ fontWeight: '500', ml: 2, mb: 0, mt: 2 }} variant="h5" gutterBottom>
            Who to follow
          </Typography>
          <List>
            {Array.from({ length: 12 }).map((_, index: number) => (
              <ListItem
                key={index}
                secondaryAction={
                  <Skeleton
                    variant="rectangular"
                    animation="wave"
                    sx={{
                      borderRadius: '20px',
                      px: '12px',
                      py: '4px',
                      color: 'transparent'
                    }}
                  >
                    xxxxxx
                  </Skeleton>
                }
              >
                <Skeleton animation="wave" variant="circular" width={40} height={40} />
                <Skeleton
                  sx={{
                    maxWidth: '182px',
                    width: '100%',
                    color: 'transparent',
                    ml: 1,
                    fontSize: '24px'
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </WhoToFollowPaper>
    )
  }

  return (
    <WhoToFollowPaper elevation={0}>
      <Box>
        <Typography sx={{ fontWeight: '500', ml: 2, mb: 0, mt: 2 }} variant="h5" gutterBottom>
          Who to follow
        </Typography>
        <List>
          {data.map(user => (
            <Link key={user._id} to={`/profile/${user._id}`}>
              <ListItem
                sx={{ '&:hover': { backgroundColor: 'rgb(246, 247, 248)' } }}
                secondaryAction={
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      borderRadius: '20px',
                      textTransform: 'none',
                      px: 2,
                      py: '5px'
                    }}
                    onClick={e => {
                      e.preventDefault()
                      handleFollow(user)
                    }}
                  >
                    Follow
                  </Button>
                }
              >
                <ListItemAvatar>
                  <Avatar src={baseUrl + '/api/users/photo/' + user._id} alt={user.name} />
                </ListItemAvatar>
                <ListItemText
                  primary={user.name}
                  secondary={createHandleFromEmail(user.email)}
                  sx={{
                    maxWidth: '170px',
                    overflowX: 'hidden',
                    '.MuiListItemText-primary:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                  primaryTypographyProps={{
                    fontWeight: 500,
                    variant: 'body1',
                    width: 'fit-content'
                  }}
                />
              </ListItem>
            </Link>
          ))}
        </List>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          sx={{
            '& .MuiPaper-root': {
              color: '#2196F3',
              bgcolor: '#fff',
              borderRadius: '12px'
            }
          }}
          open={snackbarInfo.open}
          onClose={() =>
            setSnackbarInfo({
              open: false,
              message: ''
            })
          }
          autoHideDuration={6000}
          message={<span>{snackbarInfo.message}</span>}
        />
      </Box>
    </WhoToFollowPaper>
  )
}
