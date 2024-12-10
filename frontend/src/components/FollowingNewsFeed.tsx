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
    }
  })

  return (
    <Grid container spacing={2} sx={{ borderRight: '1px solid #e5e7eb' }}>
      <Grid item sx={{ width: '100%' }}>
        <Card sx={{ borderRadius: 0 }}>
          <NewPost />
          <PostList arePostsPending={isPending} posts={posts} />
        </Card>
      </Grid>
    </Grid>
  )
}
