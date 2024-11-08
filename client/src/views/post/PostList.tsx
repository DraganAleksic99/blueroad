import { TPost } from './NewsFeed'
import Post from './Post'

type Props = {
  posts: TPost[]
  removePost?: (post: TPost) => void
}

export default function PostList({ posts, removePost }: Props) {
  return (
    <div style={{ maxWidth: "715px", margin: "auto", backgroundColor: "rgba(246, 247, 248, 0.5)" }}>
      {posts.map(item => {
        return <Post post={item} key={item._id} onRemove={removePost} />
      })}
    </div>
  )
}
