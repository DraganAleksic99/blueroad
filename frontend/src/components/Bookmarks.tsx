import { useQuery } from '@tanstack/react-query'
import PostList from '../views/post/PostList'
import { getBookmarks } from '../services/userService'
import auth, { Session } from '../auth/authHelper'

export default function Bookmarks() {
  const { user, token }: Session = auth.isAuthenticated()
  
  const { data, isPending } = useQuery({
    queryKey: ['bookmarks', user, token],
    queryFn: async () => {
      return getBookmarks(user._id, token)
    }
  })

  return <PostList posts={data?.bookmarkedPosts} arePostsPending={isPending} />
}
