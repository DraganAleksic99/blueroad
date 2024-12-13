import { useNavigate } from 'react-router-dom'
import { Box, Typography, IconButton } from '@mui/material'
import { ArrowBackRounded as ArrowBackRoundedIcon } from '@mui/icons-material'
import Tooltip from './Tooltip'

export default function SectionTitle({ title }: { title: string }) {
  const navigate = useNavigate()

  return (
    <Box
      position="sticky"
      top={0}
      pl="10px"
      display="flex"
      alignItems="center"
      sx={{
        zIndex: 999,
        backdropFilter: 'blur(12px)'
      }}
    >
      <Tooltip title="Back" offset={12}>
        <IconButton
          disableRipple
          size="small"
          sx={{
            '& .MuiSvgIcon-root': {
              color: 'rgb(33, 150, 243)'
            },
            '&:hover': {
              backgroundColor: 'rgba(33, 150, 243, 0.1)'
            }
          }}
          onClick={() => navigate(-1)}
        >
          <ArrowBackRoundedIcon />
        </IconButton>
      </Tooltip>
      <Typography
        variant="h6"
        sx={{ p: '10px', fontWeight: 'bold', color: 'rgb(33, 150, 243)', width: '100%' }}
      >
        {title}
      </Typography>
    </Box>
  )
}
