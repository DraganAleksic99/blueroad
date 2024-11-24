import Comment from '../../components/Comment'
import { TFollowCallbackFn } from '../../components/FollowProfileButton'
import { TComment } from '../../routes/NewsFeed'

type Props = {
  postId: string
  comments: TComment[]
  isFollowing: boolean
  handleFollowOrUnfollow: (callbackFn: TFollowCallbackFn, postUserId: string) => void
}

export default function Comments({ postId, handleFollowOrUnfollow, comments, isFollowing }: Props) {
  return (
    <div>
      {comments.map((comment) => {
        return (
          <Comment
            key={comment._id}
            postId={postId}
            comment={comment}
            isFollowing={isFollowing}
            handleFollowOrUnfollow={handleFollowOrUnfollow}
          />
        )
      })}
    </div>
  )
}
