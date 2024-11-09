import { Link } from 'react-router-dom'
import { TPost } from './NewsFeed'
import Post from './Post'

type Props = {
  posts: TPost[]
  removePost?: (post: TPost) => void
}

export default function PostList({ posts, removePost }: Props) {
  return (
    <div style={{ maxWidth: '715px', margin: 'auto', backgroundColor: 'rgba(246, 247, 248, 0.5)' }}>
      {posts.map(post => (
        <Link to={`/user/${post.postedBy._id}/post/${post._id}`} state={post} key={post._id}>
          <Post post={post} onRemove={removePost} />
        </Link>
      ))}
    </div>
  )
}
