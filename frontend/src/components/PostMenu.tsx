import { SyntheticEvent, useState } from 'react'
import { useMatch, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { IconButton, Menu, MenuItem } from '@mui/material'
import {
  MoreHoriz as MoreHorizIcon,
  FlagOutlined as FlagIcon,
  DeleteOutlined as DeleteIcon,
  PersonRemoveOutlined as PersonRemoveIcon,
  PersonAddAlt1Outlined as PersonAddAlt1Icon,
  LinkOutlined as LinkOutlinedIcon,
  ContentPasteOutlined as ContentPasteOutlinedIcon
} from '@mui/icons-material'
import Tooltip from './Tooltip'
import { followUser, unfollowUser } from '../services/userService'
import { removePost } from '../services/postService'
import auth, { Session, copyToClipboard } from '../utils/utils'
import { TPost } from '../routes/NewsFeed'
import { TFollowCallbackFn } from './FollowProfileButton'

type Props = {
  post: TPost
  isFollowing: boolean
  redirectAfterDelete: boolean
  handleFollowOrUnfollow: (callbackFn: TFollowCallbackFn, postUserId: string) => void
  setSnackbarInfo: React.Dispatch<
    React.SetStateAction<{
      open: boolean
      message: string
    }>
  >
}

export default function PostMenu({
  post,
  isFollowing,
  redirectAfterDelete,
  handleFollowOrUnfollow,
  setSnackbarInfo
}: Props) {
  const { user, token }: Session = auth.isAuthenticated()
  const queryClient = useQueryClient()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const match = useMatch('/profile/:userId')
  const navigate = useNavigate()

  const removePostMutation = useMutation({
    mutationFn: async () => {
      return removePost(post._id, token)
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: [`${match ? 'posts' : 'newsfeed'}`, match ? user._id : user, token]
      })

      const previousPostsData: TPost[] = queryClient.getQueryData([
        `${match ? 'posts' : 'newsfeed'}`,
        match ? user._id : user,
        token
      ])

      queryClient.setQueryData(
        [`${match ? 'posts' : 'newsfeed'}`, match ? user._id : user, token],
        (oldPosts: TPost[]) => {
          const posts = [...oldPosts]
          return posts.filter((newPost: TPost) => newPost._id !== post._id)
        }
      )

      return { previousPostsData }
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['posts'], refetchType: 'all' })
      queryClient.invalidateQueries({ queryKey: ['newsfeed'], refetchType: 'all' })

      if (redirectAfterDelete) navigate('/')
    },
    onSuccess: () => {
      setSnackbarInfo({
        open: true,
        message: 'Post succesfully deleted!'
      })
    }
  })

  const deletePost = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    e.preventDefault()
    removePostMutation.mutate()
    setAnchorEl(null)
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    setAnchorEl(event.currentTarget)
  }

  return (
    <>
      <Tooltip title="More" offset={8}>
        <IconButton
          disableRipple
          size="small"
          sx={{
            '&:hover': {
              backgroundColor: 'rgba(33, 150, 243, 0.1)',
              '& .MuiSvgIcon-root': {
                color: 'rgb(33, 150, 243)'
              }
            }
          }}
          onClick={handleMenuOpen}
        >
          <MoreHorizIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={(e: SyntheticEvent) => {
          e.preventDefault()
          setAnchorEl(null)
        }}
        disableScrollLock={true}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            minWidth: '200px',
            '& .MuiList-root': {
              padding: '8px 0'
            },
            '& .MuiMenuItem-root': {
              fontWeight: '500',
              py: 1
            }
          }
        }}
      >
        {post.postedBy._id === user._id && (
          <MenuItem sx={{ color: 'red' }} onClick={deletePost}>
            <DeleteIcon sx={{ mr: '12px' }} /> Delete
          </MenuItem>
        )}
        {post.postedBy._id !== user._id && post.postedBy._id !== match?.params?.userId && (
          <MenuItem
            onClick={e => {
              e.preventDefault()

              if (isFollowing) {
                handleFollowOrUnfollow(unfollowUser, post.postedBy._id)
                setAnchorEl(null)
              } else {
                handleFollowOrUnfollow(followUser, post.postedBy._id)
                setAnchorEl(null)
              }
            }}
          >
            {isFollowing ? (
              <PersonRemoveIcon sx={{ mr: '12px' }} />
            ) : (
              <PersonAddAlt1Icon sx={{ mr: '12px' }} />
            )}
            {isFollowing ? 'Unfollow' : 'Follow'} {post.postedBy.name}
          </MenuItem>
        )}
        <MenuItem
          onClick={e => {
            e.preventDefault()
            copyToClipboard(post.text, setSnackbarInfo)
            setAnchorEl(null)
          }}
        >
          <ContentPasteOutlinedIcon sx={{ mr: '12px' }} />
          Copy post text
        </MenuItem>
        <MenuItem
          onClick={e => {
            e.preventDefault()
            copyToClipboard(
              "https://blue-road.netlify.app" + '/user/' + post.postedBy._id + '/post/' + post._id,
              setSnackbarInfo
            )
            setAnchorEl(null)
          }}
        >
          <LinkOutlinedIcon sx={{ mr: '12px' }} />
          Copy link to post
        </MenuItem>
        <MenuItem
          onClick={e => {
            e.preventDefault()
            setAnchorEl(null)
          }}
        >
          <FlagIcon sx={{ mr: '12px' }} /> Report post
        </MenuItem>
      </Menu>
    </>
  )
}
