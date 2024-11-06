import { TPost } from './NewsFeed'
import Post from './Post'

type Props = {
  posts: TPost[]
  removePost?: (post: TPost) => void
}

export default function PostList({ posts, removePost }: Props) {
  return (
    <div style={{ marginTop: '4px', maxWidth: "715px", margin: "auto" }}>
      {posts.map(item => {
        return <Post post={item} key={item._id} onRemove={removePost} />
      })}
    </div>
  )
}
