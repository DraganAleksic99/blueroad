import { baseUrl } from '../config/config'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Box, CardContent, Tooltip, IconButton, TextField, styled, Avatar } from '@mui/material'
import { Send as SendIcon } from '@mui/icons-material'
import { comment } from '../services/postService'
import auth, { Session } from '../auth/authHelper'
import { TPost } from '../views/post/NewsFeed'

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
  postId: string
}

export default function Reply({ postId }: Props) {
  const { user, token }: Session = auth.isAuthenticated()
  const queryClient = useQueryClient()
  const [commentText, setCommentText] = useState('')

  const { mutate } = useMutation({
    mutationFn: async (text: string) => {
      return comment(user._id, token, postId, { text })
    },
    onMutate: async text => {
      await queryClient.cancelQueries({ queryKey: ['post', postId, token] })

      const previousPost = queryClient.getQueryData(['post', postId, token])

      queryClient.setQueryData(['post', postId, token], (post: TPost) => ({
        ...post,
        comments: [
          {
            _id: '123456',
            text,
            created: new Date(),
            postedBy: {
              _id: user._id,
              name: user.name,
              email: user.email
            }
          },
          ...post.comments
        ]
      }))

      return { previousPost }
    },
    onError: (_err, _newPost, context) => {
      queryClient.setQueryData(['post', postId, token], context.previousPost)
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

  return (
    <CardContent
      sx={{
        pl: 2,
        pt: 0,
        '&.MuiCardContent-root:last-child': {
          paddingBottom: 2
        }
      }}
    >
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Link to={`/user/${user._id}`}>
          <Avatar src={baseUrl + '/api/users/photo/' + user._id} alt={user.name} />
        </Link>
        <StyledTextField
          autoFocus
          fullWidth
          size="small"
          placeholder="Post your reply..."
          onKeyDown={e => {
            if (e.code === 'Enter') {
              e.preventDefault()
              mutate(commentText)
              setCommentText('')
            }
          }}
          value={commentText}
          onChange={e => {
            e.preventDefault()
            setCommentText(e.target.value)
          }}
          onClick={e => e.preventDefault()}
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
          <span onClickCapture={e => e.preventDefault()}>
            <IconButton
              sx={{ transform: 'rotate(-20deg)', '&:hover': { color: '#2196F3' }, p: 0, pt: '4px' }}
              onClick={e => {
                e.preventDefault()
                mutate(commentText)
                setCommentText('')
              }}
              disabled={!commentText.trim()}
            >
              <SendIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </CardContent>
  )
}
