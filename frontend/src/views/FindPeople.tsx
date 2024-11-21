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
import { followUser } from '../services/userService'
import { getUsersToFollow } from '../services/userService'
import auth, { Jwt } from '../auth/authHelper'
import { TUser } from './Profile'

const WhoToFollowPaper = styled(Paper)({
  position: 'sticky',
  top: 8,
  maxHeight: 'calc(100vh - 8px)',
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
  const { user, token }: Jwt = auth.isAuthenticated()
  const { data, isPending } = useQuery(usersToFollowQuery(user._id, token))
  const [buttonIndex, setButtonIndex] = useState(-1)

  const queryClient = useQueryClient()
  const [followedUserName, setFollowedUserName] = useState('')
  const [snackbarInfo, setSnackbarInfo] = useState({
    open: false,
    message: ''
  })

  const { mutate, isPending: isMutationPending } = useMutation({
    mutationFn: (userToFollow: TUser) => {
      return followUser(user._id, token, userToFollow._id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usersToFollow'] })
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
      <WhoToFollowPaper>
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
    <WhoToFollowPaper>
      <Box>
        <Typography sx={{ fontWeight: '500', ml: 2, mb: 0, mt: 2 }} variant="h5" gutterBottom>
          Who to follow
        </Typography>
        <List>
          {data.map((user, index) => (
            <ListItem
              key={user._id}
              secondaryAction={
                <Button
                disabled={isMutationPending && (buttonIndex === index)}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderRadius: '20px',
                    textTransform: 'none',
                    px: 2
                  }}
                  onClick={() => {
                    handleFollow(user)
                    setButtonIndex(index)
                  }
                  }
                >
                  Follow
                </Button>
              }
            >
              <Link to={`/user/${user._id}`}>
                <ListItemAvatar>
                  <Avatar src={baseUrl + '/api/users/photo/' + user._id} alt={user.name} />
                </ListItemAvatar>
              </Link>
              <ListItemText
                primary={user.name}
                secondary={user.email}
                sx={{
                  maxWidth: '170px',
                  overflowX: 'hidden'
                }}
                primaryTypographyProps={{
                  fontWeight: 500,
                  variant: 'body1'
                }}
              />
            </ListItem>
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
              bgcolor: 'rgba(191, 191, 191, 0.2)'
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
