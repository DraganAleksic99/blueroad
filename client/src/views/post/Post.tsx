import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
  TextField,
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
  Send as SendIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Bookmark as BookmarkIcon,
  Flag as FlagIcon,
  Delete as DeleteIcon,
  PersonRemove as PersonRemoveIcon,
  PersonAddAlt1 as PersonAddAlt1Icon
} from '@mui/icons-material'
import { TPost } from './NewsFeed'
import auth, { Jwt } from '../../auth/authHelper'
import { follow, unfollow } from '../../services/userService'
import { removePost, comment, like, unlike } from '../../services/postService'

const baseUrl = 'https://social-media-app-69re.onrender.com'

const ActionButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 20,
    backgroundColor: theme.palette.action.hover,
    '&:hover': {
      backgroundColor: theme.palette.action.selected
    }
  }
}))

type Props = {
  post: TPost
  onRemove: (post: TPost) => void
}

type FollowCallback = typeof follow
type UnfollowCallback = typeof unfollow

export default function Post({ post, onRemove }: Props) {
  const [isLiked, setIsLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes.length)
  const [commentsCount, setCommentsCount] = useState(post.comments.length)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [isFollowing, setIsFollowing] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [snackbarInfo, setSnackbarInfo] = useState({
    open: false,
    message: ''
  })
  const session: Jwt = auth.isAuthenticated()

  useEffect(() => {
    checkIsFollowing(post.postedBy._id)
    checkLike(post.likes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkIsFollowing = (postUserId: string) => {
    const match = session.user.following?.some(f => f._id === postUserId)
    setIsFollowing(match)
  }

  const handleFollowOrUnfollow = (
    callbackFn: FollowCallback | UnfollowCallback,
    session: Jwt,
    postUserId: string
  ) => {
    callbackFn({ userId: session.user._id }, { t: session.token }, postUserId).then(data => {
      if (data.error) {
        setSnackbarInfo({ open: true, message: data.error })
      } else {
        session.user.following = data.following
        setIsFollowing(!isFollowing)

        if (isFollowing) {
          setSnackbarInfo({ open: true, message: `You unfollowed ${data.name}` })
        } else {
          setSnackbarInfo({ open: true, message: `You followed ${data.name}` })
        }
      }
    })
  }

  const handleLike = () => {
    const callApi = isLiked ? unlike : like

    callApi(
      {
        userId: session.user._id
      },
      {
        t: session.token
      },
      post._id
    ).then(data => {
      if (data.error) {
        setSnackbarInfo({ open: true, message: data.error })
      } else {
        setLikesCount(data.likes.length)
        setIsLiked(!isLiked)
      }
    })
  }

  const handleSave = () => {
    setSaved(!saved)
  }

  const checkLike = (likes: string[]) => {
    const match = likes.indexOf(session.user._id) !== -1
    setIsLiked(match)
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const deletePost = () => {
    removePost(
      {
        postId: post._id
      },
      {
        t: session.token
      }
    ).then(data => {
      if (data.error) {
        setSnackbarInfo({ open: true, message: data.error })
      } else {
        setSnackbarInfo({
          open: true,
          message: 'Post succesfully deleted!'
        })
        setAnchorEl(null)
        onRemove(post)
      }
    })
  }

  const handleAddComment = event => {
    if (event.code === 'Enter') {
      event.preventDefault()

      comment(
        {
          userId: session.user._id
        },
        {
          t: session.token
        },
        post._id,
        { text: newComment }
      ).then(data => {
        if (data.error) {
          setSnackbarInfo({
            open: true,
            message: data.error
          })
        } else {
          setNewComment('')
          setSnackbarInfo({
            open: true,
            message: 'Reply succesfully sent!'
          })
          setCommentsCount(commentsCount + 1)
        }
      })
    }
  }

  return (
    <Card sx={{ mt: '8px', borderRadius: 2 }}>
      <CardHeader
        sx={{ pb: 0 }}
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
              onClose={() => setAnchorEl(null)}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {post.postedBy._id === session.user._id ? (
                <MenuItem sx={{ color: 'red' }} onClick={deletePost}>
                  <DeleteIcon sx={{ mr: 1 }} /> Delete
                </MenuItem>
              ) : (
                <MenuItem
                  onClick={() => {
                    if (isFollowing) {
                      handleFollowOrUnfollow(unfollow, session, post.postedBy._id)
                      setAnchorEl(null)
                    } else {
                      handleFollowOrUnfollow(follow, session, post.postedBy._id)
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
              <MenuItem>
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
      />

      <CardContent sx={{ p: 0 }}>
        <Box sx={{ pl: '72px', pr: 2 }}>
          <Typography variant="body1">{post.text}</Typography>

          {post.photo && (
            <CardMedia
              component="img"
              height="400"
              image={baseUrl + '/api/posts/photo/' + post._id}
              alt="Post content"
              sx={{ objectFit: 'cover', border: '1px solid #2196F3', borderRadius: '12px', mt: 2 }}
            />
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ pl: '64px', py: 1 }}>
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
            startIcon={
              isLiked ? (
                <FavoriteIcon color="error" />
              ) : (
                <FavoriteBorderIcon
                  sx={{
                    '&:hover': {
                      color: '#2196F3'
                    }
                  }}
                />
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
            startIcon={
              <ChatBubbleOutlineIcon
                sx={{
                  '&:hover': {
                    color: '#2196F3'
                  }
                }}
              />
            }
            onClick={() => setShowComments(!showComments)}
          >
            {commentsCount}
          </ActionButton>
        </Tooltip>
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

      <Collapse in={showComments} timeout="auto" unmountOnExit>
        <CardContent sx={{ pl: '72px', pt: 0 }}>
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <StyledTextField
              fullWidth
              size="small"
              placeholder="Post your reply..."
              onKeyDown={handleAddComment}
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
            />
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
              <IconButton color="primary" onClick={handleAddComment} disabled={!newComment.trim()}>
                <SendIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Collapse>
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
