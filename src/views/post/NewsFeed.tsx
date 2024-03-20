import { useState, useEffect } from 'react'
import { Card, Typography, Divider, useTheme, Grid } from '@mui/material'
import { listNewsFeed } from '../../services/postService'
import auth from '../../auth/authHelper'
import PostList from './PostList'
import NewPost from './NewPost'
import { TUser } from '../Profile'
import MainLayout from '../../layouts/MainLayout'
import FindPeople from '../../views/FindPeople'

export type TComment = {
  _id?: string
  text: string
  created?: Date
  postedBy?: {
    _id: string
    name: string
  }
}

export type TPost = {
  _id: string
  text: string
  photo: {
    data: Buffer
    contentType: string
  }
  postedBy: TUser
  created: Date
  likes: TUser[]
  comments: TComment[]
}

export default function NewsFeed() {
  const theme = useTheme()
  const [posts, setPosts] = useState<TPost[]>([])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    const jwt = auth.isAuthenticated()

    listNewsFeed(
      {
        userId: jwt.user._id
      },
      {
        t: jwt.token
      },
      signal
    ).then(data => {
      if (data.error) {
        console.log(data.error)
      } else {
        setPosts(data)
      }
    })

    return function cleanup() {
      abortController.abort()
    }
  }, [])

  const addPost = (post: TPost) => {
    const updatedPosts = [...posts]
    updatedPosts.unshift(post)
    setPosts(updatedPosts)
  }

  const removePost = (post: TPost) => {
    const updatedPosts = [...posts]
    const index = updatedPosts.indexOf(post)
    updatedPosts.splice(index, 1)
    setPosts(updatedPosts)
  }

  return (
    <Grid container spacing={3}>
      <Grid item lg={8}>
        <Card>
          <MainLayout>
            <Typography variant="h5" sx={{ mb: theme.spacing(3) }}>
              {' '}
              Newsfeed{' '}
            </Typography>
            <Divider />
            <NewPost addPost={addPost} />
            <Divider />
            <PostList removePost={removePost} posts={posts} />
          </MainLayout>
        </Card>
      </Grid>
      <Grid item lg={4}>
        <Card sx={{ position: 'sticky', inset: 0, top: '64px' }}>
          <MainLayout>
            <FindPeople />
          </MainLayout>
        </Card>
      </Grid>
    </Grid>
  )
}
