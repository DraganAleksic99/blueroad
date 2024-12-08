import { useQuery } from '@tanstack/react-query'
import PostList from '../views/post/PostList'
import { getBookmarks } from '../services/userService'
import auth, { Session } from '../auth/authHelper'
import { Box } from '@mui/material'

export default function Bookmarks() {
  const { user, token }: Session = auth.isAuthenticated()

  const { data, isPending } = useQuery({
    queryKey: ['bookmarks', user, token],
    queryFn: async () => {
      return getBookmarks(user._id, token)
    }
  })

  return (
    <Box sx={{ borderRight: '1px solid #e5e7eb' }}>
      <PostList posts={data?.bookmarkedPosts} arePostsPending={isPending} />
    </Box>
  )
}
