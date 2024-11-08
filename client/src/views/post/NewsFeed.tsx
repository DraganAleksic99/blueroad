import { useState, useEffect } from 'react'
import {
  Card,
  Grid,
} from '@mui/material'
import { listNewsFeed } from '../../services/postService'
import auth, { Jwt } from '../../auth/authHelper'
import PostList from './PostList'
import { TUser } from '../Profile'
import MainLayout from '../../layouts/MainLayout'
import NewPost from './NewPost'
import FindPeople from '../FindPeople'

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
  likes: string[]
  comments: TComment[]
}

export default function NewsFeed() {
  const [posts, setPosts] = useState<TPost[]>([])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    const jwt: Jwt = auth.isAuthenticated()

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
    <Grid container spacing={2}>
      <Grid item lg={8}>
        <Card>
          <MainLayout>
            <NewPost addPost={addPost} />
            <PostList removePost={removePost} posts={posts} />
          </MainLayout>
        </Card>
      </Grid>
      <Grid sx={{ p: 0, backgroundColor: "rgba(246, 247, 248, 0.5)"}} item lg={4}>
        <FindPeople />
      </Grid>
    </Grid>
  )
}
