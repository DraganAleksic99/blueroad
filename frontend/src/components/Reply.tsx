import { baseUrl } from '../config/config'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { UseMutateFunction } from '@tanstack/react-query'
import { Box, CardContent, Tooltip, IconButton, TextField, styled, Avatar } from '@mui/material'
import { Send as SendIcon } from '@mui/icons-material'
import auth, { Session } from '../auth/authHelper'
import { TComment } from '../views/post/NewsFeed'

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
  commentMutation: UseMutateFunction<
    {
      _id: string
      comments: TComment[]
    },
    Error,
    string
  >
}

export default function Reply({ commentMutation }: Props) {
  const { user }: Session = auth.isAuthenticated()
  const [commentText, setCommentText] = useState('')

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
              commentMutation(commentText)
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
                commentMutation(commentText)
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
