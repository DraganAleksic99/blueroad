import { useQuery } from '@tanstack/react-query'
import { useMatch } from 'react-router-dom'
import { Box } from '@mui/material'
import FollowGrid from '../components/FollowGrid'
import SectionTitle from '../components/SectionTitle'
import { listLikedByUsers } from '../services/postService'
import auth, { Session } from '../auth/authHelper'

export default function LikedBy() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user, token }: Session = auth.isAuthenticated()
  const match = useMatch('/user/:userId/post/:postId/likedBy')

  const { data } = useQuery({
    queryKey: ['likedBy', match.params.postId, token],
    queryFn: async () => {
      return listLikedByUsers(match.params.postId, token)
    },
    staleTime: Infinity
  })

  return (
    <Box>
      <SectionTitle title="Liked by" />
      <FollowGrid users={data} />
    </Box>
  )
}
