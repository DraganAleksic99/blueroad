import { useQuery } from '@tanstack/react-query'
import { Box, Card, Typography } from '@mui/material'
import { BookmarkBorder as BookmarkBorderIcon } from '@mui/icons-material'
import PostList from '../views/post/PostList'
import SectionTitle from './SectionTitle'
import { getBookmarks } from '../services/userService'
import auth, { Session } from '../utils/utils'

export default function Bookmarks() {
  const { user, token }: Session = auth.isAuthenticated()

  const { data, isPending } = useQuery({
    queryKey: ['bookmarks', user, token],
    queryFn: async () => {
      return getBookmarks(user._id, token)
    },
    staleTime: Infinity
  })

  return (
    <Box sx={{ borderRight: '1px solid #e5e7eb' }}>
      <SectionTitle title="Bookmarks" />
      {data?.bookmarkedPosts.length === 0 && (
            <Card elevation={0} sx={{ p: 2, backgroundColor: 'rgba(246, 247, 248, 0.5)' }}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="100%"
                textAlign="center"
              >
                <BookmarkBorderIcon sx={{ fontSize: 64, color: 'gray', mb: 2 }} />
                <Typography variant="inherit" color="textSecondary">
                  No bookmarked posts yet.
                </Typography>
              </Box>
            </Card>
      )} 
      <PostList posts={data?.bookmarkedPosts} arePostsPending={isPending} />
    </Box>
  )
}
