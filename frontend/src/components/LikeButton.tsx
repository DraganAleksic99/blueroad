import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDebouncedCallback, useThrottledCallback } from 'use-debounce'
import { Box, Button, styled } from '@mui/material'
import { FavoriteBorder as FavoriteBorderIcon, Favorite as FavoriteIcon } from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import Tooltip from './Tooltip'
import { likePost, unlikePost } from '../services/postService'
import auth, { Session } from '../utils/utils'
import { TPost } from '../routes/NewsFeed'

const ActionButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  color: theme.palette.text.secondary,
  borderRadius: '8px',
  padding: 0,
  paddingBlock: '3px',
  maxHeight: '34px',
  '&:hover': {
    backgroundColor: 'rgba(249, 24, 128, 0.1)',
    '& .MuiButton-startIcon': {
      color: 'rgb(249, 24, 128)'
    },
    '&': {
      color: 'rgb(249, 24, 128)'
    }
  }
}))

type likeFn = typeof likePost
type unlikeFn = typeof unlikePost

export type TLikeCallbackFn = likeFn | unlikeFn

type Props = {
  post: TPost
  onLike: React.Dispatch<React.SetStateAction<number>>
  isOnDiscoverFeed: boolean
}

export default function LikeButton({ post, onLike, isOnDiscoverFeed }: Props) {
  const queryClient = useQueryClient()
  const { user, token }: Session = auth.isAuthenticated()

  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes.length)
  const [previousLikeMutation, setPreviousLikeMutation] = useState<'liked' | 'unliked'>('liked')

  const checkIsLiked = (likes: string[]) => {
    const match = likes.indexOf(user._id) !== -1
    setIsLiked(match)

    if (match) {
      setPreviousLikeMutation('liked')
    } else {
      setPreviousLikeMutation('unliked')
    }
  }

  useEffect(() => {
    checkIsLiked(post.likes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        onLike(data.length)
      }

      queryClient.invalidateQueries({
        queryKey: ['post'],
        refetchType: 'all'
      })

      queryClient.invalidateQueries({
        queryKey: [isOnDiscoverFeed ? 'discover' : 'newsfeed'],
        refetchType: 'all'
      })

      queryClient.invalidateQueries({
        queryKey: ['posts'],
        refetchType: 'all'
      })

      queryClient.invalidateQueries({
        queryKey: ['likedBy'],
        refetchType: 'all'
      })
    }
  })

  const debouncedLikeMutation = useDebouncedCallback(likeMutation.mutate, 200, {
    leading: true,
    trailing: false
  })

  const optimisticLikeUpdate = () => {
    setIsLiked(!isLiked)

    if (previousLikeMutation === 'unliked' && !isLiked) {
      setIsLiked(true)
      onLike(likesCount + 1)
      return setLikesCount(likesCount + 1)
    }

    if (previousLikeMutation === 'liked' && isLiked) {
      setIsLiked(false)
      onLike(likesCount - 1)
      return setLikesCount(likesCount - 1)
    }

    if (isLiked) {
      onLike(likesCount - 1)
      setLikesCount(likesCount - 1)
    } else {
      onLike(likesCount + 1)
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

  return (
    <Tooltip title={isLiked ? 'Unlike' : 'Like'} offset={isLiked ? 0 : -7}>
      <ActionButton
        sx={{ color: isLiked ? 'rgb(249, 24, 128)' : '', borderRadius: '30px' }}
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
        <Box display="flex" alignItems="center" pt="2px">
          <AnimatePresence initial={false} mode="wait" >
            <motion.span
              key={likesCount}
              initial={{ y: likesCount % 2 === 0 ? -7 : 7 }}
              animate={{ y: 0 }}
              exit={{ y: likesCount % 2 === 0 ? -7 : 7 }}
              transition={{ duration: 0.1, ease: 'easeOut' }}
            >
              {likesCount}
            </motion.span>
          </AnimatePresence>
        </Box>
      </ActionButton>
    </Tooltip>
  )
}
