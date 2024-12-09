import { Box, Typography, Card } from '@mui/material'
import { ChatBubbleOutline as ChatBubbleOutlineIcon } from '@mui/icons-material'
import Comment from '../../components/Comment'
import { TFollowCallbackFn } from '../../components/FollowProfileButton'
import { TComment } from '../../routes/NewsFeed'

type Props = {
  postId: string
  comments: TComment[]
  isFollowing: boolean
  handleFollowOrUnfollow: (callbackFn: TFollowCallbackFn, postUserId: string) => void
}

export default function Comments({ postId, handleFollowOrUnfollow, comments, isFollowing }: Props) {
  if (comments.length === 0) {
    return (
      <Card sx={{ p: 2 }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100%"
          textAlign="center"
        >
          <ChatBubbleOutlineIcon sx={{ fontSize: 64, color: 'gray', mb: 2 }} />
          <Typography variant="inherit" color="textSecondary">
            No comments yet.
          </Typography>
        </Box>
      </Card>
    )
  }

  return (
    <>
      {comments.map(comment => {
        return (
          <Comment
            key={comment._id}
            postId={postId}
            comment={comment}
            isFollowing={isFollowing}
            handleFollowOrUnfollow={handleFollowOrUnfollow}
          />
        )
      })}
      <Box height="25vh"></Box>
    </>
  )
}
