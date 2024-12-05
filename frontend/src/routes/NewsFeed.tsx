import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Card, Grid } from '@mui/material'
import { listNewsFeed } from '../services/postService'
import auth, { Session } from '../auth/authHelper'
import PostList from '../views/post/PostList'
import { TUser } from './Profile'
import NewPost from '../views/post/NewPost'

export type TComment = {
  _id?: string
  text: string
  created?: Date
  postedBy?: {
    _id: string
    name: string
    email: string
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
  imagePreview?: string
}

export default function NewsFeed() {
  const queryClient = useQueryClient()
  const { user, token }: Session = auth.isAuthenticated()
  const [posts, setPosts] = useState<TPost[]>([])
  const { data, isPending, isSuccess } = useQuery({
    queryKey: ['newsfeed', user, token],
    queryFn: async () => {
      return listNewsFeed(user._id, token)
    }
  })

  useEffect(() => {
    if (!isSuccess) return
    setPosts(data)
  }, [isSuccess, data])

  const removePost = (post: TPost) => {
    const updatedPosts = [...posts]
    const index = updatedPosts.indexOf(post)
    updatedPosts.splice(index, 1)
    setPosts(updatedPosts)
    queryClient.invalidateQueries({ queryKey: ['newsfeed'] })
  }

  return (
    <Grid container spacing={2} sx={{ borderRight: '1px solid #e5e7eb' }}>
      <Grid item sx={{ width: '100%' }}>
        <Card>
          <NewPost />
          <PostList arePostsPending={isPending} removePost={removePost} posts={posts} />
        </Card>
      </Grid>
    </Grid>
  )
}
