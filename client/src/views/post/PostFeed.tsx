import { useMatch } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Card,
  Grid,
} from '@mui/material'
import MainLayout from '../../layouts/MainLayout'
import Post from './Post'
import FindPeople from '../FindPeople'
import auth from '../../auth/authHelper'
import { loadPost } from '../../services/postService'

export default function PostFeed() {
  const { token } = auth.isAuthenticated()
  const { params: { postId }} = useMatch('/user/:userId/post/:postId')
    const { data: post, isPending } = useQuery({
      queryKey: ['post', postId, token],
      queryFn: async () => {
        return loadPost( postId,token)
      }
    })

    if (isPending) {
      return <h1>Loading...</h1>
    }

  return (
    <Grid container spacing={2}>
      <Grid item lg={8}>
        <Card>
          <MainLayout>
            <Post post={post} showComments/>
          </MainLayout>
        </Card>
      </Grid>
      <Grid sx={{ p: 0, backgroundColor: "rgba(246, 247, 248, 0.5)"}} item lg={4}>
        <FindPeople />
      </Grid>
    </Grid>
  )
}
