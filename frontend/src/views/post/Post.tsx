import { baseUrl } from '../../config/config'
import { SyntheticEvent, useEffect, useState } from 'react'
import { Link, useMatch, useLocation } from 'react-router-dom'
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
import Reply from '../../components/Reply'
import Comments from './Comments'
import auth, { Session } from '../../auth/authHelper'
import { followUser, unfollowUser } from '../../services/userService'
import { removePost, likePost, unlikePost, comment } from '../../services/postService'
import { addBookmark, removeBookmark } from '../../services/userService'
import { TUser } from '../../routes/Profile'
import { TFollowCallbackFn } from '../../components/FollowProfileButton'
import { TComment, TPost } from '../../routes/NewsFeed'

const ActionButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}))

type likeFn = typeof likePost
type unlikeFn = typeof unlikePost
type addBookmarkFn = typeof addBookmark
type removeBookmarkFn = typeof removeBookmark

export type TLikeCallbackFn = likeFn | unlikeFn
export type TBookmarkCallbackFn = addBookmarkFn | removeBookmarkFn

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
  const { state } = useLocation()

  const [likesCount, setLikesCount] = useState(post.likes.length)
  const [previousLikeMutation, setPreviousLikeMutation] = useState<'liked' | 'unliked'>('liked')
  const [previousBookmarkMutation, setPreviousBookmarkMutation] = useState<
    'bookmark' | 'unbookmark'
  >('bookmark')

  const [isLiked, setIsLiked] = useState(false)
  const [isBookmark, setIsBookmark] = useState(false)
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
    checkisBookmarked()
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

  const optimisticBookmarkUpdate = () => {
    setIsBookmark(!isBookmark)

    if (previousBookmarkMutation === 'unbookmark' && !isBookmark) {
      return setIsBookmark(true)
    }

    if (previousBookmarkMutation === 'bookmark' && isBookmark) {
      return setIsBookmark(false)
    }
  }

  const throttledOptimisticBookmarkUpdate = useThrottledCallback(optimisticBookmarkUpdate, 200, {
    leading: true,
    trailing: false
  })

  const bookmarkMutation = useMutation({
    mutationFn: async (callbackFn: TBookmarkCallbackFn) => {
      return callbackFn(user._id, token, post)
    },
    onMutate: async () => {
      if (previousBookmarkMutation === 'bookmark') {
        setPreviousBookmarkMutation('unbookmark')

        if (!match) return

        await queryClient.cancelQueries({ queryKey: ['bookmarks', user, token] })

        const previousBookmarks = queryClient.getQueryData(['bookmarks', user, token])

        queryClient.setQueryData(['bookmarks', user, token], (oldData: { _id: string, bookmarkedPosts: TPost[]}) => {
          const updatedBookmarks =  [...oldData.bookmarkedPosts.filter(oldPost => oldPost._id !== post._id)]

          return {
            ...oldData,
            bookmarkedPosts: updatedBookmarks
          }
        })

        return { previousBookmarks }
      } else {
        setPreviousBookmarkMutation('bookmark')
      }
    },
    onError(_err, _newPost, context) {
      if (previousBookmarkMutation === 'unbookmark') {
        queryClient.setQueryData(['bookmarks', user, token], context.previousBookmarks)
      }

      setIsBookmark(!isBookmark)
      setSnackbarInfo({
        open: true,
        message: `Something went wrong. Please try again.`
      })
    },
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: ['bookmarks', user, token],
        refetchType: 'all'
      })

      queryClient.invalidateQueries({
        queryKey: ['ids', user, token],
        refetchType: 'all'
      })
    }
  })

  const debouncedBookmarkMutation = useDebouncedCallback(bookmarkMutation.mutate, 200, {
    leading: true,
    trailing: false
  })

  const handleBookmark = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    const callbackFn = previousBookmarkMutation === 'bookmark' ? removeBookmark : addBookmark

    throttledOptimisticBookmarkUpdate()
    debouncedBookmarkMutation(callbackFn)
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

  const checkisBookmarked = () => {

    let ids = []

    if (!bookmarkedPostsIds) {
      ids = state.bookmarkedPostsIds
    } else {
      ids = bookmarkedPostsIds
    }

    const isBookmarked = ids.some(id => id === post._id)

    setIsBookmark(isBookmarked)

    if (isBookmarked) {
      setPreviousBookmarkMutation('bookmark')
    } else {
      setPreviousBookmarkMutation('unbookmark')
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
          <IconButton onClick={handleBookmark} size="small">
            {isBookmark ? (
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
