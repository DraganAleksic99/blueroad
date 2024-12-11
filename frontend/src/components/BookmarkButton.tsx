import { useState, useEffect } from 'react'
import { useMatch, useLocation } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDebouncedCallback, useThrottledCallback } from 'use-debounce'
import { IconButton } from '@mui/material'
import { Bookmark as BookmarkIcon, BookmarkBorder as BookmarkBorderIcon } from '@mui/icons-material'
import Tooltip from './Tooltip'
import { addBookmark, removeBookmark } from '../services/userService'
import auth, { Session } from '../utils/utils'
import { TPost } from '../routes/NewsFeed'

type addBookmarkFn = typeof addBookmark
type removeBookmarkFn = typeof removeBookmark

type TBookmarkCallbackFn = addBookmarkFn | removeBookmarkFn

type Props = {
  bookmarkedPostsIds: string[]
  setSnackbarInfo: React.Dispatch<
    React.SetStateAction<{
      open: boolean
      message: string
    }>
  >
  post: TPost
}

export default function BookmarkButton({ bookmarkedPostsIds, setSnackbarInfo, post }: Props) {
  const { user, token }: Session = auth.isAuthenticated()
  const queryClient = useQueryClient()
  const match = useMatch('/user/:userId')
  const { state } = useLocation()

  const [isBookmarked, setIsBookmarked] = useState(false)
  const [previousBookmarkMutation, setPreviousBookmarkMutation] = useState<
    'bookmark' | 'unbookmark'
  >('bookmark')

  const checkisBookmarked = () => {
    let ids = []

    if (!bookmarkedPostsIds) {
      ids = state?.bookmarkedPostsIds
    } else {
      ids = bookmarkedPostsIds
    }

    const isBookmarked = ids?.some(id => id === post._id)

    setIsBookmarked(isBookmarked)

    if (isBookmarked) {
      setPreviousBookmarkMutation('bookmark')
    } else {
      setPreviousBookmarkMutation('unbookmark')
    }
  }

  useEffect(() => {
    checkisBookmarked()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

        queryClient.setQueryData(
          ['bookmarks', user, token],
          (oldData: { _id: string; bookmarkedPosts: TPost[] }) => {
            const updatedBookmarks = [
              ...oldData.bookmarkedPosts.filter(oldPost => oldPost._id !== post._id)
            ]

            return {
              ...oldData,
              bookmarkedPosts: updatedBookmarks
            }
          }
        )

        return { previousBookmarks }
      } else {
        setPreviousBookmarkMutation('bookmark')
      }
    },
    onError(_err, _newPost, context) {
      if (previousBookmarkMutation === 'unbookmark') {
        queryClient.setQueryData(['bookmarks', user, token], context.previousBookmarks)
      }

      setIsBookmarked(!isBookmarked)
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

  const optimisticBookmarkUpdate = () => {
    setIsBookmarked(!isBookmarked)

    if (previousBookmarkMutation === 'unbookmark' && !isBookmarked) {
      return setIsBookmarked(true)
    }

    if (previousBookmarkMutation === 'bookmark' && isBookmarked) {
      return setIsBookmarked(false)
    }
  }

  const throttledOptimisticBookmarkUpdate = useThrottledCallback(optimisticBookmarkUpdate, 200, {
    leading: true,
    trailing: false
  })

  const handleBookmark = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    const callbackFn = previousBookmarkMutation === 'bookmark' ? removeBookmark : addBookmark

    throttledOptimisticBookmarkUpdate()
    debouncedBookmarkMutation(callbackFn)
  }

  return (
    <Tooltip
      title={isBookmarked ? 'Remove from bookmarks' : 'Bookmark'}
      offset={isBookmarked ? 66 : 24}
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
        onClick={handleBookmark}
      >
        {isBookmarked ? <BookmarkIcon sx={{ color: 'rgb(33, 150, 243)' }} /> : <BookmarkBorderIcon />}
      </IconButton>
    </Tooltip>
  )
}
