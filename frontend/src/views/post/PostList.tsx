import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Post from './Post'
import Spinner from '../../components/Spinner'
import { getBookmarksIds } from '../../services/userService'
import { TPost } from '../../routes/NewsFeed'
import auth, { Session } from '../../auth/authHelper'

type Props = {
  posts: TPost[]
  removePost?: (post: TPost) => void
  arePostsPending: boolean
}

export default function PostList({ posts, removePost, arePostsPending }: Props) {
  const { user, token }: Session = auth.isAuthenticated()

  const { data } = useQuery({
    queryKey: ['ids', user, token],
    queryFn: async () => {
      return getBookmarksIds(user._id, token)
    },
    staleTime: Infinity
  })

  return (
    <div style={{ minHeight: '100vh', maxWidth: '715px', margin: 'auto', backgroundColor: 'rgba(246, 247, 248, 0.5)' }}>
      { arePostsPending && <Spinner />}
      {posts?.map(post => (
        <Link
          to={`/user/${post.postedBy._id}/post/${post._id}`}
          key={post._id}
          state={{ bookmarkedPostsIds: data }}
          unstable_viewTransition
        >
          <Post post={post} onRemove={removePost} bookmarkedPostsIds={data} />
        </Link>
      ))}
    </div>
  )
}
