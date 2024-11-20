import { baseUrl } from '../config/config'
import { Box, CardContent, Tooltip, IconButton, TextField, styled, Avatar } from '@mui/material'
import { Send as SendIcon } from '@mui/icons-material'
import { Jwt } from '../auth/authHelper'

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
  comment: string
  setComment: React.Dispatch<React.SetStateAction<string>>
  handleAddComment: () => void
  session: Jwt
}

export default function Reply({ comment, setComment, handleAddComment, session }: Props) {
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
        <Avatar src={baseUrl + '/api/users/photo/' + session.user._id} alt={session.user.name} />
        <StyledTextField
          autoFocus
          fullWidth
          size="small"
          placeholder="Post your reply..."
          onKeyDown={e => {
            if (e.code === 'Enter') {
              e.preventDefault()
              handleAddComment()
            }
          }}
          value={comment}
          onChange={e => {
            e.preventDefault()
            setComment(e.target.value)
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
                handleAddComment()
              }}
              disabled={!comment.trim()}
            >
              <SendIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </CardContent>
  )
}
