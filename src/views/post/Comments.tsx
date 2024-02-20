import { useState } from 'react'
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
import auth from '../../auth/authHelper'

const baseUrl = 'https://social-media-app-backend-production-679e.up.railway.app'

export default function Comments({ postId, updateComments, comments }) {
  const theme = useTheme()
  const [text, setText] = useState('')
  const jwt = auth.isAuthenticated()

  const handleChange = event => {
    setText(event.target.value)
  }
  const addComment = event => {
    if (event.keyCode == 13 && event.target.value) {
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

  const deleteComment = comment => {
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

  const commentBody = item => {
    return (
      <p>
        <Link to={'/user/' + item.postedBy._id}>{item.postedBy.name}</Link>
        <br />
        <span>{new Date(item.created).toDateString()} |</span>
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
      {comments.map((item, i) => {
        return (
          <div key={i}>
            <CardHeader
              avatar={<Avatar src={baseUrl + '/api/users/photo/' + item.postedBy._id} />}
              subheader={commentBody(item)}
              action={
                auth.isAuthenticated().user._id === item.postedBy._id && (
                  <IconButton onClick={() => deleteComment(item)}>
                    <DeleteIcon />
                  </IconButton>
                )
              }
            />
            <CardContent
              sx={{ mt: `-${theme.spacing(6)}`, mb: `-${theme.spacing(5)}`, ml: theme.spacing(7) }}
            >
              <p>{item.text}</p>
            </CardContent>
          </div>
        )
      })}
    </div>
  )
}
