import { baseUrl } from '../config/config'

import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { UseMutateFunction } from '@tanstack/react-query'
import { Box, CardContent, Button, TextField, styled, Avatar, Stack } from '@mui/material'
import auth, { Session } from '../utils/utils'
import { TComment } from '../routes/NewsFeed'

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    fontSize: '1.2rem',
    padding: 0,
    paddingBottom: 1,
    '& fieldset': {
      borderColor: 'transparent'
    },
    '&:hover fieldset': {
      borderColor: 'transparent'
    },
    '&.Mui-focused fieldset': {
      borderColor: 'transparent'
    }
  }
})

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

const MAX_CHARS = 300

export default function Reply({ commentMutation }: Props) {
  const { user }: Session = auth.isAuthenticated()
  const [commentText, setCommentText] = useState('')
  const { pathname } = useLocation()
  const progress = (commentText.length / MAX_CHARS) * 100

  return (
    <CardContent
      sx={{
        borderTop: '1px solid #e5e7eb',
        p: 2,
        '&:last-child': {
          pb: 2
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
          multiline
          size="small"
          inputProps={{
            maxLength: MAX_CHARS
          }}
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
      </Box>
      <Stack sx={{ justifyContent: 'flex-end', pt: 1 }} direction="row">
        <Box display="flex">
          <Box display="flex" alignItems="center">
            <Box sx={{ mr: 2 }}>{MAX_CHARS - commentText.length}</Box>
            <svg style={{ height: '25px', width: '25px', marginRight: '16px' }} viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="none" stroke="#e5e7eb" strokeWidth="2" />
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="rgb(33, 150, 243)"
                strokeWidth="2"
                strokeDasharray="62.83185307179586"
                strokeDashoffset={62.83185307179586 - (progress / 100) * 62.83185307179586}
                transform="rotate(-90 12 12)"
              />
            </svg>
          </Box>
          <Button
            disableRipple
            size="small"
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
              px: 2,
              height: '34px',
              backgroundColor: 'rgb(33, 150, 243)',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '15px',
              '&.Mui-disabled': {
                backgroundColor: 'rgba(33, 150, 243, 0.5)',
                color: 'rgba(255, 255, 255, 0.8)',
              }
            }}
            onClick={e => {
              e.preventDefault()
              commentMutation(commentText)
              setCommentText('')
            }}
            disabled={!commentText.trim()}
          >
            Reply
          </Button>
        </Box>
      </Stack>
    </CardContent>
  )
}
