import { useState } from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Avatar,
  IconButton,
  Divider,
  useTheme
} from '@mui/material'
import {
  Delete as DeleteIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Comment as CommentIcon
} from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { removePost, like, unlike } from '../../services/postService'
import auth from '../../auth/authHelper'
import Comments from './Comments'
import { TPost, TComment } from './NewsFeed'
import { TUser } from '../Profile'

type Props = {
  post: TPost
  onRemove: (post: TPost) => void
}

const baseUrl = 'https://social-media-app-backend-production-679e.up.railway.app'

export default function Post({ post, onRemove }: Props) {
  const theme = useTheme()
  const jwt = auth.isAuthenticated()

  const checkLike = (likes: TUser[]) => {
    const match = likes.indexOf(jwt.user._id) !== -1
    return match
  }

  const [values, setValues] = useState({
    like: checkLike(post.likes),
    likes: post.likes.length,
    comments: post.comments
  })

  const clickLike = () => {
    const callApi = values.like ? unlike : like
    callApi(
      {
        userId: jwt.user._id
      },
      {
        t: jwt.token
      },
      post._id
    ).then(data => {
      if (data.error) {
        console.log(data.error)
      } else {
        setValues({ ...values, like: !values.like, likes: data.likes.length })
      }
    })
  }

  const updateComments = (comments: TComment[]) => {
    setValues({ ...values, comments: comments })
  }

  const deletePost = () => {
    removePost(
      {
        postId: post._id
      },
      {
        t: jwt.token
      }
    ).then(data => {
      if (data.error) {
        console.log(data.error)
      } else {
        onRemove(post)
      }
    })
  }

  return (
    <Card sx={{ mb: theme.spacing(2) }}>
      <CardHeader
        avatar={<Avatar src={baseUrl + '/api/users/photo/' + post.postedBy._id} />}
        action={
          post.postedBy._id === auth.isAuthenticated().user._id && (
            <IconButton onClick={deletePost}>
              <DeleteIcon />
            </IconButton>
          )
        }
        title={<Link to={'/user/' + post.postedBy._id}>{post.postedBy.name}</Link>}
        subheader={new Date(post.created).toDateString()}
      />
      <CardContent sx={{ ml: theme.spacing(7), mt: '-20px' }}>
        <Typography component="p">{post.text}</Typography>
        {post.photo && (
          <div style={{ marginBlockStart: theme.spacing(3) }}>
            <img src={baseUrl + '/api/posts/photo/' + post._id} />
          </div>
        )}
      </CardContent>
      <CardActions sx={{ ml: theme.spacing(7) }}>
        {values.like ? (
          <IconButton onClick={clickLike} aria-label="Like" color="secondary">
            <FavoriteIcon />
          </IconButton>
        ) : (
          <IconButton onClick={clickLike} aria-label="Unlike" color="secondary">
            <FavoriteBorderIcon />
          </IconButton>
        )}{' '}
        <span>{values.likes}</span>
        <IconButton aria-label="Comment" color="secondary">
          <CommentIcon />
        </IconButton>{' '}
        <span>{values.comments.length}</span>
      </CardActions>
      <Divider />
      <Comments postId={post._id} comments={values.comments} updateComments={updateComments} />
    </Card>
  )
}
