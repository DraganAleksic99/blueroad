import { baseUrl } from '../config/config'

import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { UseMutateFunction } from '@tanstack/react-query'
import { Box, CardContent, IconButton, TextField, styled, Avatar } from '@mui/material'
import { Send as SendIcon } from '@mui/icons-material'

import Tooltip from './Tooltip'
import auth, { Session } from '../auth/authHelper'
import { TComment } from '../routes/NewsFeed'

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
  const { pathname } = useLocation()

  return (
    <CardContent
      sx={{
        borderTop: '1px solid #e5e7eb',
        pl: 2,
        pt: 2,
        '&.MuiCardContent-root:last-child': {
          paddingBottom: 2
        }
      }}
    >
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Link to={`/profile/${user._id}`}>
          <Avatar src={baseUrl + '/api/users/photo/' + user._id} alt={user.name} />
        </Link>
        <StyledTextField
          autoFocus={pathname === '/' ? true : false}
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
        <Tooltip title="Reply" offset={34}>
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
