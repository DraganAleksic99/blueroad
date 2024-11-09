import { useState } from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  IconButton,
  Tooltip,
  Menu,
  MenuItem
} from '@mui/material'
import {
  DeleteOutlined as DeleteIcon,
  MoreHoriz as MoreHorizIcon,
  FlagOutlined as FlagIcon,
  PersonRemoveOutlined as PersonRemoveIcon,
  PersonAddAlt1Outlined as PersonAddAlt1Icon
} from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { uncomment } from '../../services/postService'
import { follow, unfollow } from '../../services/userService'
import auth, { Jwt } from '../../auth/authHelper'
import { TComment } from './NewsFeed'
import { TCallbackFn } from '../../components/FollowProfileButton'

const baseUrl = 'https://social-media-app-69re.onrender.com'

type Props = {
  postId: string
  updateComments: (comments: TComment[]) => void
  comments: TComment[]
  isFollowing: boolean
  handleFollowOrUnfollow: (callbackFn: TCallbackFn, session: Jwt, postUserId: string) => void
}

export default function Comments({
  postId,
  updateComments,
  handleFollowOrUnfollow,
  comments,
  isFollowing
}: Props) {
  const session: Jwt = auth.isAuthenticated()
  const [anchorElements, setAnchorElements] = useState<Record<string, null | HTMLElement>>({})

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, i: number) => {
    setAnchorElements({
      ...anchorElements,
      [i]: event.currentTarget
    })
  }

  const deleteComment = (comment: TComment) => {
    uncomment(
      {
        userId: session.user._id
      },
      {
        t: session.token
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
      <div>
        <Link to={'/user/' + comment.postedBy._id}>
          <span style={{ fontWeight: 600, fontSize: '1rem' }}>{comment.postedBy.name}</span>
        </Link>
        {' • '}
        <span>{new Date(comment.created).toDateString()}</span>
      </div>
    )
  }

  return (
    <div style={{ paddingBlockEnd: '16px' }}>
      {comments.map((comment, i) => {
        return (
          <Card sx={{ mb: "2px" }} key={i}>
            <CardHeader
              sx={{ pb: 0, alignItems: 'flex-start' }}
              avatar={<Avatar src={baseUrl + '/api/users/photo/' + comment.postedBy._id} />}
              title={commentBody(comment)}
              subheader={comment.postedBy.email}
              action={
                <>
                  <Tooltip
                    title="More"
                    componentsProps={{
                      tooltip: {
                        sx: {
                          bgcolor: 'rgba(191, 191, 191, 0.2)',
                          fontSize: '14px',
                          color: '#2196F3',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }
                      }
                    }}
                  >
                    <IconButton onClick={e => handleMenuOpen(e, i)}>
                      <MoreHorizIcon
                        sx={{
                          '&:hover': {
                            color: '#2196F3'
                          }
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    elevation={1}
                    anchorEl={anchorElements[i]}
                    open={Boolean(anchorElements[i])}
                    onClose={() => setAnchorElements({ ...anchorElements, [i]: null })}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                      sx: {
                        borderRadius: '12px',
                        minWidth: '200px',
                        boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
                        '& .MuiList-root': {
                          padding: '8px 0'
                        }
                      }
                    }}
                  >
                    {comment.postedBy._id === session.user._id ? (
                      <MenuItem
                        sx={{ color: 'red' }}
                        onClick={() => {
                          deleteComment(comment)
                          setAnchorElements({ ...anchorElements, [i]: null })
                        }}
                      >
                        <DeleteIcon sx={{ mr: 1 }} /> Delete
                      </MenuItem>
                    ) : (
                      <MenuItem
                        onClick={() => {
                          if (isFollowing) {
                            handleFollowOrUnfollow(unfollow, session, comment.postedBy._id)
                            setAnchorElements({ ...anchorElements, [i]: null })
                          } else {
                            handleFollowOrUnfollow(follow, session, comment.postedBy._id)
                            setAnchorElements({ ...anchorElements, [i]: null })
                          }
                        }}
                      >
                        {isFollowing ? (
                          <PersonRemoveIcon sx={{ mr: 1 }} />
                        ) : (
                          <PersonAddAlt1Icon sx={{ mr: 1 }} />
                        )}
                        {isFollowing ? 'Unfollow' : 'Follow'} {comment.postedBy.name}
                      </MenuItem>
                    )}
                    <MenuItem
                      onClick={e => {
                        e.preventDefault()
                        setAnchorElements({ ...anchorElements, [i]: null })
                      }}
                    >
                      <FlagIcon sx={{ mr: 1 }} /> Report Comment
                    </MenuItem>
                  </Menu>
                </>
              }
            />
            <CardContent
              sx={{
                pl: '72px',
                pt: "4px",
                '&.MuiCardContent-root:last-child': {
                  paddingBottom: '12px'
                }
              }}
            >
              <div>{comment.text}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
