import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Box,
  Skeleton,
  IconButton
} from '@mui/material'
import {
  MoreHoriz as MoreHorizIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon,
  BookmarkBorder as BookmarkBorderIcon,
  FavoriteBorder as FavoriteBorderIcon,
  AssessmentOutlined as AssessmentOutlinedIcon,
} from '@mui/icons-material'
import { ActionButton } from '../../views/post/Post'

export default function PostSkeleton() {
  return (
    <Card
      sx={{
        borderRadius: 0
      }}
    >
      <CardHeader
        sx={{ pb: 0, alignItems: 'flex-start' }}
        avatar={<Skeleton animation="wave" variant="circular" width={40} height={40} />}
        action={
          <IconButton size="small">
            <MoreHorizIcon />
          </IconButton>
        }
        title={
          <Skeleton variant="text" animation="wave" sx={{ color: 'transparent' }}>
            xxxxxxxxxxxxxxxxx
          </Skeleton>
        }
        subheader={
          <Skeleton variant="text" animation="wave" sx={{ color: 'transparent' }}>
            xxxxxxxxxxxxxxxxxxxxxxxxxx
          </Skeleton>
        }
      />

      <CardContent sx={{ p: 0, pt: '4px' }}>
        <Box sx={{ pl: 2, pr: 2 }}>
          <Skeleton variant="text" animation="wave" sx={{ width: '100%' }}></Skeleton>
          <Skeleton variant="text" animation="wave" sx={{ width: '100%' }}></Skeleton>
          <Skeleton variant="text" animation="wave" sx={{ width: '80%' }}></Skeleton>
        </Box>
      </CardContent>

      <Box
        sx={{
          py: 1,
          mx: 2,
          mt: '10px',
          borderTop: '1px solid #e5e7eb',
          borderBottom: '1px solid #e5e7eb'
        }}
      >
        <Skeleton sx={{ color: 'transparent' }} animation="wave" variant="text">
          xxxxxxxxx
        </Skeleton>
      </Box>

      <CardActions
        sx={{
          pl: 1,
          py: '6px',
          pr: '8px',
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
          <ActionButton sx={{ borderRadius: '30px' }} startIcon={<FavoriteBorderIcon />}>
            0
          </ActionButton>
          <ActionButton sx={{ borderRadius: '30px' }} startIcon={<ChatBubbleOutlineIcon />}>
            0
          </ActionButton>
          <ActionButton sx={{ borderRadius: '30px' }} startIcon={<AssessmentOutlinedIcon />}>
            0
          </ActionButton>
        <IconButton size="small">
          <BookmarkBorderIcon />
        </IconButton>
      </CardActions>
    </Card>
  )
}
