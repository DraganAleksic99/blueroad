import { Link } from 'react-router-dom'
import Post from './Post'
import Spinner from '../../components/Spinner'
import { TPost } from '../../routes/NewsFeed'

type Props = {
  posts: TPost[]
  removePost?: (post: TPost) => void
  arePostsPending: boolean
}

export default function PostList({ posts, removePost, arePostsPending }: Props) {
  if (arePostsPending) {
    return (
      <Spinner />
    )
  }
  
  return (
    <div style={{ maxWidth: '715px', margin: 'auto', backgroundColor: 'rgba(246, 247, 248, 0.5)' }}>
      {posts?.map(post => (
        <Link to={`/user/${post.postedBy._id}/post/${post._id}`} key={post._id} unstable_viewTransition>
          <Post post={post} onRemove={removePost} />
        </Link>
      ))}
    </div>
  )
}
