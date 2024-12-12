import { useQuery } from '@tanstack/react-query'
import { Card, Grid } from '@mui/material'
import PostList from '../views/post/PostList'
import { listDiscoverNewsFeed } from '../services/postService'
import auth, { Session } from '../utils/utils'

export default function DiscoverNewsFeed() {
  const { user, token }: Session = auth.isAuthenticated()

  const { data: posts, isPending } = useQuery({
    queryKey: ['discover', user, token],
    queryFn: async () => {
      return listDiscoverNewsFeed(user._id, token)
    },
    staleTime: Infinity
  })

  return (
    <Grid container spacing={2} sx={{ borderRight: '1px solid #e5e7eb' }}>
      <Grid item sx={{ width: '100%' }}>
        <Card sx={{ borderRadius: 0 }}>
          <PostList isOnDiscoverFeed={true} arePostsPending={isPending} posts={posts} />
        </Card>
      </Grid>
    </Grid>
  )
}
