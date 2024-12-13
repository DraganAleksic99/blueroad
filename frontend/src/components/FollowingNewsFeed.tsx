import { useQuery } from '@tanstack/react-query'
import { Card, Grid } from '@mui/material'
import PostList from '../views/post/PostList'
import NewPost from '../views/post/NewPost'
import { listFollowingNewsFeed } from '../services/postService'
import auth, { Session } from '../utils/utils'

export default function FollowingNewsFeed() {
  const { user, token }: Session = auth.isAuthenticated()

  const { data: posts, isPending } = useQuery({
    queryKey: ['newsfeed', user, token],
    queryFn: async () => {
      return listFollowingNewsFeed(user._id, token)
    },
    staleTime: Infinity
  })

  return (
    <Grid container spacing={2}>
      <Grid item sx={{ width: '100%' }}>
        <Card sx={{ borderRadius: 0 }}>
          <NewPost />
          <PostList isOnDiscoverFeed={false} arePostsPending={isPending} posts={posts} />
        </Card>
      </Grid>
    </Grid>
  )
}
