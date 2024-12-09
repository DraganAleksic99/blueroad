import { baseUrl } from '../../config/config'

import { useEffect, useState } from 'react'
import { Link, useMatch } from 'react-router-dom'
import { useQueryClient, useMutation, UseMutateFunction } from '@tanstack/react-query'

import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CardMedia,
  Avatar,
  Typography,
  Button,
  Collapse,
  Box,
  Snackbar,
  styled
} from '@mui/material'

import { ChatBubbleOutline as ChatBubbleOutlineIcon } from '@mui/icons-material'
import Reply from '../../components/Reply'
import Comments from './Comments'
import BookmarkButton from '../../components/BookmarkButton'
import Tooltip from '../../components/Tooltip'
import LikeButton from '../../components/LikeButton'
import PostMenu from '../../components/PostMenu'

import { comment } from '../../services/postService'
import auth, { Session } from '../../auth/authHelper'
import { TUser } from '../../routes/Profile'
import { TFollowCallbackFn } from '../../components/FollowProfileButton'
import { TComment, TPost } from '../../routes/NewsFeed'

const ActionButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  color: theme.palette.text.secondary,
  borderRadius: '8px',
  padding: 0,
  paddingBlock: '3px',
  fontSize: '1rem',
  maxHeight: '34px',
  '&:hover': {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    '& .MuiButton-startIcon': {
      color: 'rgb(33, 150, 243)'
    },
    '&': {
      color: 'rgb(33, 150, 243)'
    }
  }
}))

type Props = {
  post: TPost
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
  showComments,
  bookmarkedPostsIds,
  commentMutation
}: Props) {
  const queryClient = useQueryClient()
  const { user, token }: Session = auth.isAuthenticated()
  const match = useMatch('/user/:userId/post/:postId')

  const [isFollowing, setIsFollowing] = useState<boolean>()
  const [showReplyButton, setShowReplyButton] = useState(false)

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

  useEffect(() => {
    checkIsFollowing(post.postedBy)
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
    },
    onError() {
      setIsFollowing(!isFollowing)
      setSnackbarInfo({
        open: true,
        message: `Somenthing went wrong. Please try again.`
      })
    }
  })

  const handleFollowOrUnfollow = (callbackFn: TFollowCallbackFn, postUserId: string) => {
    followMutation.mutate({ callbackFn, postUserId })
  }

  return (
    <Card
      sx={{
        borderRadius: 0,
        '&:hover': {
          backgroundColor: `${match && match.params?.postId ? '' : 'rgb(246, 247, 248)'}`,
          '& .MuiCollapse-root': {
            backgroundColor: '#fff'
          }
        },
        borderBottom: match ? '' : '1px solid #e5e7eb'
      }}
    >
      <CardHeader
        sx={{ pb: 0, alignItems: 'flex-start' }}
        avatar={
          <Link to={`/profile/${post.postedBy._id}`}>
            <Avatar
              src={baseUrl + '/api/users/photo/' + post.postedBy._id}
              alt={post.postedBy.name}
            />
          </Link>
        }
        action={
          <PostMenu
            post={post}
            isFollowing={isFollowing}
            redirectAfterDelete={!!match}
            handleFollowOrUnfollow={handleFollowOrUnfollow}
            setSnackbarInfo={setSnackbarInfo}
          />
        }
        title={
          <>
            <Link to={`/profile/${post.postedBy._id}`}>
              <span className="text-underline" style={{ fontWeight: 600, fontSize: '1rem' }}>
                {post.postedBy.name}
              </span>
            </Link>
            {' • '}
            <span>{new Date(post.created).toDateString()}</span>
          </>
        }
        subheader={post.postedBy.email}
      />

      <CardContent sx={{ p: 0, pt: '4px' }}>
        <Box sx={{ pl: match && match.params?.postId ? '16px' : '72px', pr: 2 }}>
          <Typography variant="body1">{post.text}</Typography>

          {post.imagePreview && (
            <CardMedia
              loading="lazy"
              component="img"
              image={post.imagePreview}
              alt="Post content"
              sx={{ objectFit: 'cover', border: '1px solid #e5e7eb', borderRadius: '12px', mt: 1 }}
            />
          )}

          {post.photo && (
            <CardMedia
              loading="lazy"
              component="img"
              image={baseUrl + '/api/posts/photo/' + post._id}
              alt="Post content"
              sx={{ objectFit: 'cover', border: '1px solid #e5e7eb', borderRadius: '12px', mt: 1 }}
            />
          )}
        </Box>
      </CardContent>

      <CardActions
        sx={{
          pl: match && match.params?.postId ? '8px' : '64px',
          py: '6px',
          pr: '8px',
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <Box display="flex" width="30%" justifyContent="space-between">
          <LikeButton post={post} />
          <Tooltip title="Reply" offset={-5}>
            <ActionButton
              sx={{ borderRadius: '30px' }}
              startIcon={<ChatBubbleOutlineIcon />}
              onClick={e => {
                e.preventDefault()
                setShowReplyButton(!showReplyButton)
              }}
            >
              {post.comments.length}
            </ActionButton>
          </Tooltip>
        </Box>
        <BookmarkButton
          bookmarkedPostsIds={bookmarkedPostsIds}
          post={post}
          setSnackbarInfo={setSnackbarInfo}
        />
      </CardActions>
      {showComments && (
        <>
          <Reply commentMutation={commentMutation} />
          <Box sx={{ borderTop: '1px solid #e5e7eb', borderRadius: 0 }}>
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
            bgcolor: '#fff',
            borderRadius: '12px'
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
