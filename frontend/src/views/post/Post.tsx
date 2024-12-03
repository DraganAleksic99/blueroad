import { baseUrl } from '../../config/config'
import { SyntheticEvent, useEffect, useState } from 'react'
import { Link, useMatch } from 'react-router-dom'
import { useQueryClient, useMutation, UseMutateFunction } from '@tanstack/react-query'
import { useDebouncedCallback, useThrottledCallback } from 'use-debounce'
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
  Snackbar,
  styled
} from '@mui/material'
import {
  MoreHoriz as MoreHorizIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon,
  FlagOutlined as FlagIcon,
  DeleteOutlined as DeleteIcon,
  PersonRemoveOutlined as PersonRemoveIcon,
  PersonAddAlt1Outlined as PersonAddAlt1Icon
} from '@mui/icons-material'
import Reply from '../../components/Reply'
import Comments from './Comments'
import BookmarkButton from '../../components/BookmarkButton'
import Tooltip from '../../components/Tooltip'
import auth, { Session } from '../../auth/authHelper'
import { followUser, unfollowUser } from '../../services/userService'
import { removePost, likePost, unlikePost, comment } from '../../services/postService'
import { TUser } from '../../routes/Profile'
import { TFollowCallbackFn } from '../../components/FollowProfileButton'
import { TComment, TPost } from '../../routes/NewsFeed'

const ActionButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  color: theme.palette.text.secondary,
  borderRadius: '8px',
  padding: 0,
  paddingBlock: '4px'
}))

type likeFn = typeof likePost
type unlikeFn = typeof unlikePost

export type TLikeCallbackFn = likeFn | unlikeFn

type Props = {
  post: TPost
  onRemove?: (post: TPost) => void
  showComments?: boolean
  bookmarkedPostsIds?: string[]
  commentMutation?: UseMutateFunction<
    {
      _id: string
      comments: TComment[]
    },
    Error,
    string,
    {
      previousPost: unknown
    }
  >
}

export default function Post({
  post,
  onRemove,
  showComments,
  bookmarkedPostsIds,
  commentMutation
}: Props) {
  const queryClient = useQueryClient()
  const { user, token }: Session = auth.isAuthenticated()
  const match = useMatch('/user/:userId')

  const [likesCount, setLikesCount] = useState(post.likes.length)
  const [previousLikeMutation, setPreviousLikeMutation] = useState<'liked' | 'unliked'>('liked')

  const [isLiked, setIsLiked] = useState(false)
  const [isFollowing, setIsFollowing] = useState<boolean>()
  const [showReplyButton, setShowReplyButton] = useState(false)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const [snackbarInfo, setSnackbarInfo] = useState({
    open: false,
    message: ''
  })

  const addCommentMutation = useMutation({
    mutationFn: async (text: string) => {
      return comment(user._id, token, post._id, { text })
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['newsfeed', user, token] })

      const previousData = queryClient.getQueryData(['newsfeed', user, token])

      queryClient.setQueryData(['newsfeed', user, token], (oldPosts: TPost[]) => {
        const postToUpdate = oldPosts.find(oldPost => oldPost._id === post._id)
        postToUpdate.comments.length += 1
        const postToUpdateIndex = oldPosts.findIndex(oldPost => oldPost._id === post._id)

        return [
          ...oldPosts.slice(0, postToUpdateIndex),
          postToUpdate,
          ...oldPosts.slice(postToUpdateIndex + 1)
        ]
      })

      return { previousData }
    },
    onError: (_err, _newPost, context) => {
      queryClient.setQueryData(['newsfeed', user, token], context.previousData)
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

  const removePostMutation = useMutation({
    mutationFn: async () => {
      return removePost(post._id, token)
    },
    onSuccess: () => {
      setSnackbarInfo({
        open: true,
        message: 'Post succesfully deleted!'
      })
      setAnchorEl(null)
      onRemove(post)
      if (match.params.userId && match.params.userId === user._id) {
        queryClient.invalidateQueries({ queryKey: ['posts'] })
      }
    }
  })

  const likeMutation = useMutation({
    mutationFn: async (callbackFn: TLikeCallbackFn) => {
      return callbackFn(user._id, token, post._id)
    },
    onMutate() {
      if (previousLikeMutation === 'liked') {
        setPreviousLikeMutation('unliked')
      } else {
        setPreviousLikeMutation('liked')
      }
    },
    onSettled(data) {
      const match = data.indexOf(user._id) !== -1

      if (match !== isLiked) {
        setIsLiked(match)
        setLikesCount(data.length)
      }

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

  const debouncedLikeMutation = useDebouncedCallback(likeMutation.mutate, 200, {
    leading: true,
    trailing: false
  })

  useEffect(() => {
    checkIsFollowing(post.postedBy)
    checkLike(post.likes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkIsFollowing = (postUser: TUser) => {
    // @ts-expect-error todo: fix on backend
    const match = postUser?.followers?.some(id => id === user._id)
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
      return callbackFn(user._id, token, postUserId)
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

  const optimisticLikeUpdate = () => {
    setIsLiked(!isLiked)

    if (previousLikeMutation === 'unliked' && !isLiked) {
      setIsLiked(true)
      return setLikesCount(likesCount + 1)
    }

    if (previousLikeMutation === 'liked' && isLiked) {
      setIsLiked(false)
      return setLikesCount(likesCount - 1)
    }

    if (isLiked) {
      setLikesCount(likesCount - 1)
    } else {
      setLikesCount(likesCount + 1)
    }
  }

  const throttledOptimisticLikeUpdate = useThrottledCallback(optimisticLikeUpdate, 200, {
    leading: true,
    trailing: false
  })

  const handleLike = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    const callbackFn = previousLikeMutation === 'liked' ? unlikePost : likePost

    throttledOptimisticLikeUpdate()
    debouncedLikeMutation(callbackFn)
  }

  const checkLike = (likes: string[]) => {
    const match = likes.indexOf(user._id) !== -1
    setIsLiked(match)
    if (match) {
      setPreviousLikeMutation('liked')
    } else {
      setPreviousLikeMutation('unliked')
    }
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    setAnchorEl(event.currentTarget)
  }

  const deletePost = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    e.preventDefault()
    removePostMutation.mutate()
    setAnchorEl(null)
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
              offset={24}
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
              disableScrollLock={true}
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
              {post.postedBy._id === user._id && (
                <MenuItem sx={{ color: 'red' }} onClick={deletePost}>
                  <DeleteIcon sx={{ mr: 1 }} /> Delete
                </MenuItem>
              )}
              {post.postedBy._id !== user._id && post.postedBy._id !== match?.params?.userId && (
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

          {post.imagePreview && (
            <CardMedia
              loading="lazy"
              component="img"
              image={post.imagePreview}
              alt="Post content"
              sx={{ objectFit: 'cover', border: '1px solid #2196F3', borderRadius: '12px', mt: 1 }}
            />
          )}

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
        sx={{ pl: '62px', py: 1, pr: '8px', display: 'flex', justifyContent: 'space-between' }}
      >
        <div>
          <Tooltip
            title={isLiked ? 'Unlike' : 'Like'}
            offset={isLiked ? 15 : 7}
          >
            <ActionButton
              sx={{
                color: isLiked ? 'rgb(249, 24, 128)' : '',
                '&:hover': {
                  backgroundColor: 'rgba(249, 24, 128, 0.1)',
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
            offset={12}
          >
            <ActionButton
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(33, 150, 243, 0.1)',
                  '& .MuiButton-startIcon': {
                    color: 'rgb(33, 150, 243)'
                  },
                  '&': {
                    color: 'rgb(33, 150, 243)'
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
        <BookmarkButton
          bookmarkedPostsIds={bookmarkedPostsIds}
          post={post}
          setSnackbarInfo={setSnackbarInfo}
        />
      </CardActions>
      {showComments && (
        <>
          <Reply commentMutation={commentMutation} />
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
          <Reply commentMutation={addCommentMutation.mutate} />
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
