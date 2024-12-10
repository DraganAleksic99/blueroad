import { baseUrl } from '../config/config'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  IconButton,
  Tooltip,
  Menu,
  MenuItem
} from '@mui/material'
import {
  DeleteOutlined as DeleteIcon,
  MoreHoriz as MoreHorizIcon,
  FlagOutlined as FlagIcon,
  PersonRemoveOutlined as PersonRemoveIcon,
  PersonAddAlt1Outlined as PersonAddAlt1Icon
} from '@mui/icons-material'
import { followUser, unfollowUser } from '../services/userService'
import { uncomment } from '../services/postService'
import auth, { Session } from '../auth/authHelper'
import { TComment, TPost } from '../routes/NewsFeed'
import { TFollowCallbackFn } from './FollowProfileButton'
import { createHandleFromEmail } from '../utils/utils'

type Props = {
  postId?: string
  comment: TComment
  isFollowing?: boolean
  handleFollowOrUnfollow?: (callbackFn: TFollowCallbackFn, postUserId: string) => void
}

export default function Comment({ postId, comment, isFollowing, handleFollowOrUnfollow }: Props) {
  const queryClient = useQueryClient()
  const [anchorEl, setAnchorEl] = useState<HTMLElement>()
  const { user, token }: Session = auth.isAuthenticated()

  const { mutate } = useMutation({
    mutationFn: async () => {
      return uncomment(user._id, token, postId, comment)
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['post', postId, token] })

      const previousPostData: TPost = queryClient.getQueryData(['post', postId, token])

      queryClient.setQueryData(['post', postId, token], (oldPost: TPost) => ({
        ...oldPost,
        comments: [...oldPost.comments.filter(c => c._id !== comment._id)]
      }))

      return { previousPostData }
    },
    onError: (_err, _newPost, context) => {
      queryClient.setQueryData(['post', postId, token], context.previousPostData)
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['post'],
        refetchType: 'all'
      })

      queryClient.invalidateQueries({
        queryKey: ['newsfeed'],
        refetchType: 'all'
      })

      queryClient.invalidateQueries({
        queryKey: ['posts'],
        refetchType: 'all'
      })
    }
  })

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  return (
    <Card
      elevation={0}
      sx={{
        '&:last-child': {
          mb: 0,
          borderBottom: 'none'
        },
        borderRadius: 0,
        borderBottom: '1px solid #e5e7eb'
      }}
    >
      <CardHeader
        sx={{ pb: 0, alignItems: 'flex-start' }}
        avatar={
          <Link to={`/profile/${comment.postedBy._id}`}>
            <Avatar src={baseUrl + '/api/users/photo/' + comment.postedBy._id} />
          </Link>
        }
        title={
          <div>
            <Link to={'/profile/' + comment.postedBy._id}>
              <span className="text-underline" style={{ fontWeight: 600, fontSize: '1rem' }}>
                {comment.postedBy.name}
              </span>
            </Link>
            {' • '}
            <span>{new Date(comment.created).toDateString()}</span>
          </div>
        }
        subheader={createHandleFromEmail(comment.postedBy.email)}
        action={
          <>
            <Tooltip
              title="More"
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: 'rgba(191, 191, 191, 0.2)',
                    fontSize: '14px',
                    color: '#2196F3',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }
                }
              }}
            >
              <IconButton
                size="small"
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    '& .MuiSvgIcon-root': {
                      color: 'rgb(33, 150, 243)'
                    }
                  }
                }}
                onClick={e => handleMenuOpen(e)}
              >
                <MoreHorizIcon />
              </IconButton>
            </Tooltip>
            <Menu
              elevation={1}
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
                  boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
                  '& .MuiList-root': {
                    padding: '8px 0'
                  },
                  '& .MuiMenuItem-root': {
                    fontWeight: '500'
                  }
                }
              }}
            >
              {comment.postedBy._id === user._id ? (
                <MenuItem
                  sx={{ color: 'red' }}
                  onClick={() => {
                    mutate()
                    setAnchorEl(null)
                  }}
                >
                  <DeleteIcon sx={{ mr: '12px' }} /> Delete
                </MenuItem>
              ) : (
                <MenuItem
                  onClick={() => {
                    if (isFollowing) {
                      handleFollowOrUnfollow(unfollowUser, comment.postedBy._id)
                      setAnchorEl(null)
                    } else {
                      handleFollowOrUnfollow(followUser, comment.postedBy._id)
                      setAnchorEl(null)
                    }
                  }}
                >
                  {isFollowing ? (
                    <PersonRemoveIcon sx={{ mr: '12px' }} />
                  ) : (
                    <PersonAddAlt1Icon sx={{ mr: '12px' }} />
                  )}
                  {isFollowing ? 'Unfollow' : 'Follow'} {comment.postedBy.name}
                </MenuItem>
              )}
              <MenuItem
                onClick={e => {
                  e.preventDefault()
                  setAnchorEl(null)
                }}
              >
                <FlagIcon sx={{ mr: '12px' }} /> Report Comment
              </MenuItem>
            </Menu>
          </>
        }
      />
      <CardContent
        sx={{
          pl: '72px',
          pt: '4px',
          '&.MuiCardContent-root:last-child': {
            paddingBottom: '12px'
          }
        }}
      >
        <div>{comment.text}</div>
      </CardContent>
    </Card>
  )
}
