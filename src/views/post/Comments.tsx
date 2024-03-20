import { ChangeEvent, KeyboardEvent, useState } from 'react'
import {
  CardHeader,
  CardContent,
  TextField,
  Avatar,
  IconButton,
  Divider,
  useTheme
} from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { comment, uncomment } from '../../services/postService'
import auth, { Jwt } from '../../auth/authHelper'
import { TComment } from './NewsFeed'

const baseUrl = 'https://social-media-app-backend-production-679e.up.railway.app'

type Props = {
  postId: string
  updateComments: (comments: TComment[]) => void
  comments: TComment[]
}

export default function Comments({ postId, updateComments, comments }: Props) {
  const theme = useTheme()
  const [text, setText] = useState('')
  const jwt: Jwt = auth.isAuthenticated()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value)
  }

  const addComment = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.code === 'Enter') {
      event.preventDefault()
      comment(
        {
          userId: jwt.user._id
        },
        {
          t: jwt.token
        },
        postId,
        { text: text }
      ).then(data => {
        if (data.error) {
          console.log(data.error)
        } else {
          setText('')
          updateComments(data.comments)
        }
      })
    }
  }

  const deleteComment = (comment: TComment) => {
    uncomment(
      {
        userId: jwt.user._id
      },
      {
        t: jwt.token
      },
      postId,
      comment
    ).then(data => {
      if (data.error) {
        console.log(data.error)
      } else {
        updateComments(data.comments)
      }
    })
  }

  const commentBody = (comment: TComment) => {
    return (
      <p>
        <Link to={'/user/' + comment.postedBy._id}>{comment.postedBy.name}</Link>
        <br />
        <span>{new Date(comment.created).toDateString()} |</span>
      </p>
    )
  }

  return (
    <div style={{ paddingBlockEnd: '15px' }}>
      <CardHeader
        avatar={<Avatar src={baseUrl + '/api/users/photo/' + auth.isAuthenticated().user._id} />}
        title={
          <TextField
            onKeyDown={addComment}
            multiline
            value={text}
            onChange={handleChange}
            placeholder="Write something ..."
            InputProps={{ sx: { padding: theme.spacing(1) } }}
          />
        }
      />
      <Divider />
      {comments.map((comment, i) => {
        return (
          <div key={i}>
            <CardHeader
              avatar={<Avatar src={baseUrl + '/api/users/photo/' + comment.postedBy._id} />}
              subheader={commentBody(comment)}
              action={
                auth.isAuthenticated().user._id === comment.postedBy._id && (
                  <IconButton onClick={() => deleteComment(comment)}>
                    <DeleteIcon />
                  </IconButton>
                )
              }
            />
            <CardContent
              sx={{ mt: `-${theme.spacing(6)}`, mb: `-${theme.spacing(5)}`, ml: theme.spacing(7) }}
            >
              <p>{comment.text}</p>
            </CardContent>
          </div>
        )
      })}
    </div>
  )
}
