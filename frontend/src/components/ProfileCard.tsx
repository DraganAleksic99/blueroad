import { baseUrl } from '../config/config'

import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardMedia,
  Box,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Snackbar
} from '@mui/material'
import {
  CalendarToday as CalendarIcon,
  MoreHoriz as MoreHorizIcon,
  LinkOutlined as LinkOutlinedIcon
} from '@mui/icons-material'
import FollowProfileButton, { TFollowCallbackFn } from './FollowProfileButton'
import SectionTitle from './SectionTitle'
import Tooltip from './Tooltip'
import auth, { Session } from '../utils/utils'
import { TUser } from '../routes/Profile'
import { TPost } from '../routes/NewsFeed'
import { createHandleFromEmail, copyToClipboard } from '../utils/utils'

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const [snackbarInfo, setSnackbarInfo] = useState({
    open: false,
    message: ''
  })

  const photoUrl = user.photo
    ? `${baseUrl}/api/users/photo/${user._id}`
    : `${baseUrl}/api/defaultPhoto`

  return (
    <>
      <SectionTitle title={user.name} />
      <Card sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 2, borderRadius: 0 }}>
        <CardMedia
          component="img"
          sx={{ width: 150, height: 150, minWidth: 150, minHeight: 150, borderRadius: '50%' }}
          image={photoUrl}
        />
        <Box
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1 1 auto' }}
        >
          <CardContent sx={{ p: 0, width: '100%' }}>
            <Typography
              sx={{ display: 'flex', justifyContent: 'space-between' }}
              component="div"
              variant="h5"
            >
              {user.name}
              <Box display="flex" gap={2}>
                {session && session.user?._id === user._id ? (
                  <Link to={`/user/edit/${user._id}`} state={user}>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        px: 2,
                        textTransform: 'none',
                        borderRadius: '20px',
                        border: '1px solid rgb(33, 150, 243)',
                        color: 'rgb(33, 150, 243)'
                      }}
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
                {session && session.user?._id !== user._id && (
                  <Tooltip title="More" offset={8}>
                    <IconButton
                      onClick={e => setAnchorEl(e.currentTarget)}
                      disableRipple
                      size="small"
                      sx={{
                        border: '1px solid rgb(33, 150, 243)',
                        '& .MuiSvgIcon-root': {
                          color: 'rgb(33, 150, 243)'
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(33, 150, 243, 0.1)'
                        }
                      }}
                    >
                      <MoreHorizIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  disableScrollLock={true}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  PaperProps={{
                    sx: {
                      borderRadius: '12px',
                      minWidth: '200px',
                      '& .MuiList-root': {
                        padding: '8px 0'
                      },
                      '& .MuiMenuItem-root': {
                        fontWeight: '500',
                        py: 1
                      }
                    }
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      copyToClipboard('https://blue-road.netlify.app/profile/' + user._id, setSnackbarInfo)
                      setAnchorEl(null)
                    }}
                  >
                    <LinkOutlinedIcon sx={{ mr: '12px' }} />
                    Copy link to profile
                  </MenuItem>
                </Menu>
              </Box>
            </Typography>
            <Typography variant="subtitle1" component="div" sx={{ color: 'text.secondary', mt: 1 }}>
              {createHandleFromEmail(user.email)}
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
              {'Joined ' +
                new Date(user.created).toLocaleString('en-US', { month: 'short', year: 'numeric' })}
            </Typography>
          </CardContent>
        </Box>
      </Card>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        sx={{
          '& .MuiPaper-root': {
            bgcolor: '#2196F3',
            color: '#fff',
            borderRadius: '12px',
            fontSize: '1.1rem', 
          },
          width: 'fit-content'
        }}
        onClose={() => setSnackbarInfo({ open: false, message: '' })}
        open={snackbarInfo.open}
        autoHideDuration={6000}
        message={<span>{snackbarInfo.message}</span>}
      />
    </>
  )
}
