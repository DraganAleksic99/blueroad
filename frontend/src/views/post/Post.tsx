import { baseUrl } from '../../config/config'
import { SyntheticEvent, useEffect, useState } from 'react'
import { Link, useMatch } from 'react-router-dom'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CardMedia,
  Avatar,
  Typography,
  IconButton,
  Button,
  Collapse,
  Menu,
  MenuItem,
  Box,
  Tooltip,
  Snackbar,
  styled
} from '@mui/material'
import {
  MoreHoriz as MoreHorizIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Bookmark as BookmarkIcon,
  FlagOutlined as FlagIcon,
  DeleteOutlined as DeleteIcon,
  PersonRemoveOutlined as PersonRemoveIcon,
  PersonAddAlt1Outlined as PersonAddAlt1Icon
} from '@mui/icons-material'
import { TPost } from './NewsFeed'
import Reply from '../../components/Reply'
import auth, { Session } from '../../auth/authHelper'
import { followUser, unfollowUser } from '../../services/userService'
import { removePost, likePost, unlikePost } from '../../services/postService'
import Comments from './Comments'
import { TUser } from '../Profile'
import { TFollowCallbackFn } from '../../components/FollowProfileButton'

const ActionButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}))

type likeFn = typeof likePost
type unlikeFn = typeof unlikePost

type TLikeCallbackFn = likeFn | unlikeFn

type Props = {
  post: TPost
  onRemove?: (post: TPost) => void
  showComments?: boolean
}

export default function Post({ post, onRemove, showComments }: Props) {
  const queryClient = useQueryClient()
  const session: Session = auth.isAuthenticated()
  const match = useMatch('/user/:userId')

  const [isLiked, setIsLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isFollowing, setIsFollowing] = useState<boolean>()
  const [showReplyButton, setShowReplyButton] = useState(false)

  const [likesCount, setLikesCount] = useState(post.likes.length)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const [snackbarInfo, setSnackbarInfo] = useState({
    open: false,
    message: ''
  })

  const removePostMutation = useMutation({
    mutationFn: async () => {
      return removePost(post._id, session.token)
    },
    onSuccess: () => {
      setSnackbarInfo({
        open: true,
        message: 'Post succesfully deleted!'
      })
      setAnchorEl(null)
      onRemove(post)
      if (match.params.userId && match.params.userId === session.user._id) {
        queryClient.invalidateQueries({ queryKey: ['posts'] })
      }
    }
  })

  const likeMutation = useMutation({
    mutationFn: async (callbackFn: TLikeCallbackFn) => {
      return callbackFn(session.user._id, session.token, post._id)
    },
    onSuccess: data => {
      setLikesCount(data.length)
      setIsLiked(!isLiked)
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

  useEffect(() => {
    checkIsFollowing(post.postedBy)
    checkLike(post.likes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkIsFollowing = (postUser: TUser) => {
    // @ts-expect-error todo: fix on backend
    const match = postUser?.followers?.some(id => id === session.user._id)
    setIsFollowing(match)
  }

  const followMutation = useMutation({
    mutationFn: async ({
      callbackFn,
      postUserId
    }: {
      callbackFn: TFollowCallbackFn
      postUserId: string
    }) => {
      return callbackFn(session.user._id, session.token, postUserId)
    },
    onSuccess: data => {
      setIsFollowing(!isFollowing)
      setSnackbarInfo({
        open: true,
        message: `You ${isFollowing ? 'unfollowed' : 'followed'} ${data.name}`
      })
    }
  })

  const handleFollowOrUnfollow = (callbackFn: TFollowCallbackFn, postUserId: string) => {
    followMutation.mutate({ callbackFn, postUserId })
  }

  const handleLike = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    const callbackFn = isLiked ? unlikePost : likePost

    likeMutation.mutate(callbackFn)
  }

  const handleSave = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    setSaved(!saved)
  }

  const checkLike = (likes: string[]) => {
    const match = likes.indexOf(session.user._id) !== -1
    setIsLiked(match)
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    setAnchorEl(event.currentTarget)
  }

  const deletePost = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    e.preventDefault()
    removePostMutation.mutate()
  }

  return (
    <Card sx={{ mb: '2px', borderRadius: 2 }}>
      <CardHeader
        sx={{ pb: 0, alignItems: 'flex-start' }}
        avatar={
          <Link to={`/user/${post.postedBy._id}`}>
            <Avatar
              src={baseUrl + '/api/users/photo/' + post.postedBy._id}
              alt={post.postedBy.name}
            />
          </Link>
        }
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
              <IconButton onClick={handleMenuOpen}>
                <MoreHorizIcon
                  sx={{
                    '&:hover': {
                      color: '#2196F3'
                    }
                  }}
                />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={(e: SyntheticEvent) => {
                e.preventDefault()
                setAnchorEl(null)
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                sx: {
                  borderRadius: '12px',
                  minWidth: '200px',
                  '& .MuiList-root': {
                    padding: '8px 0'
                  }
                }
              }}
            >
              {post.postedBy._id === session.user._id && (
                <MenuItem sx={{ color: 'red' }} onClick={deletePost}>
                  <DeleteIcon sx={{ mr: 1 }} /> Delete
                </MenuItem>
              )}
              {post.postedBy._id !== session.user._id &&
                post.postedBy._id !== match?.params?.userId && (
                  <MenuItem
                    onClick={e => {
                      e.preventDefault()

                      if (isFollowing) {
                        handleFollowOrUnfollow(unfollowUser, post.postedBy._id)
                        setAnchorEl(null)
                      } else {
                        handleFollowOrUnfollow(followUser, post.postedBy._id)
                        setAnchorEl(null)
                      }
                    }}
                  >
                    {isFollowing ? (
                      <PersonRemoveIcon sx={{ mr: 1 }} />
                    ) : (
                      <PersonAddAlt1Icon sx={{ mr: 1 }} />
                    )}
                    {isFollowing ? 'Unfollow' : 'Follow'} {post.postedBy.name}
                  </MenuItem>
                )}
              <MenuItem
                onClick={e => {
                  e.preventDefault()
                  setAnchorEl(null)
                }}
              >
                <FlagIcon sx={{ mr: 1 }} /> Report post
              </MenuItem>
            </Menu>
          </>
        }
        title={
          <>
            <span style={{ fontWeight: 600, fontSize: '1rem' }}>{post.postedBy.name}</span>
            {' • '}
            <span>{new Date(post.created).toDateString()}</span>
          </>
        }
        subheader={post.postedBy.email}
      />

      <CardContent sx={{ p: 0, pt: '4px' }}>
        <Box sx={{ pl: '72px', pr: 2 }}>
          <Typography variant="body1">{post.text}</Typography>

          {post.photo && (
            <CardMedia
              loading="lazy"
              component="img"
              image={baseUrl + '/api/posts/photo/' + post._id}
              alt="Post content"
              sx={{ objectFit: 'cover', border: '1px solid #2196F3', borderRadius: '12px', mt: 1 }}
            />
          )}
        </Box>
      </CardContent>

      <CardActions
        sx={{ pl: '60px', py: 1, pr: '6px', display: 'flex', justifyContent: 'space-between' }}
      >
        <div>
          <Tooltip
            title={isLiked ? 'Unlike' : 'Like'}
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
            <ActionButton
              disabled={likeMutation.isPending}
              sx={{
                color: isLiked ? 'rgb(249, 24, 128)' : '',
                '&:hover': {
                  '& .MuiButton-startIcon': {
                    color: 'rgb(249, 24, 128)'
                  },
                  '&': {
                    color: 'rgb(249, 24, 128)'
                  }
                }
              }}
              startIcon={
                isLiked ? (
                  <FavoriteIcon
                    sx={{
                      '&': {
                        color: 'rgb(249, 24, 128)'
                      }
                    }}
                  />
                ) : (
                  <FavoriteBorderIcon />
                )
              }
              onClick={handleLike}
            >
              {likesCount}
            </ActionButton>
          </Tooltip>
          <Tooltip
            title="Reply"
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
            <ActionButton
              sx={{
                '&:hover': {
                  '& .MuiButton-startIcon': {
                    color: '#2196F3'
                  },
                  '&': {
                    color: '#2196F3'
                  }
                }
              }}
              startIcon={<ChatBubbleOutlineIcon />}
              onClick={e => {
                e.preventDefault()
                setShowReplyButton(!showReplyButton)
              }}
            >
              {post.comments.length}
            </ActionButton>
          </Tooltip>
        </div>
        <Tooltip
          title="Bookmark"
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
          <IconButton onClick={handleSave} size="small">
            {saved ? (
              <BookmarkIcon color="primary" />
            ) : (
              <BookmarkBorderIcon
                sx={{
                  '&:hover': {
                    color: '#2196F3'
                  }
                }}
              />
            )}
          </IconButton>
        </Tooltip>
      </CardActions>
      {showComments && (
        <>
          <Reply postId={post._id} />
          <Box sx={{ borderTop: '1px solid gray' }}>
            <Comments
              postId={post._id}
              comments={post.comments}
              isFollowing={isFollowing}
              handleFollowOrUnfollow={handleFollowOrUnfollow}
            />
          </Box>
        </>
      )}
      {!showComments && (
        <Collapse in={showReplyButton} timeout="auto" unmountOnExit>
          <Reply postId={post._id} />
        </Collapse>
      )}
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
        onClose={() => setSnackbarInfo({ open: false, message: '' })}
        open={snackbarInfo.open}
        autoHideDuration={6000}
        message={<span>{snackbarInfo.message}</span>}
      />
    </Card>
  )
}
