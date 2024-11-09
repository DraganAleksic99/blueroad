import { Box, CardContent, Tooltip, IconButton, TextField, styled } from '@mui/material'
import { Send as SendIcon } from '@mui/icons-material'

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
}

export default function Reply({ comment, setComment, handleAddComment }: Props) {
  return (
    <CardContent
      sx={{
        pl: '72px',
        pt: 0,
        '&.MuiCardContent-root:last-child': {
          paddingBottom: 2
        }
      }}
    >
      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
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
              sx={{ transform: 'rotate(-15deg)', '&:hover': { color: '#2196F3' } }}
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
