import { useMatch } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Card,
  Grid,
} from '@mui/material'
import MainLayout from '../layouts/MainLayout'
import Post from '../views/post/Post'
import FindPeople from '../views/FindPeople'
import auth from '../auth/authHelper'
import { loadPost, comment } from '../services/postService'
import { TPost } from './NewsFeed'

export default function PostFeed() {
  const { user, token } = auth.isAuthenticated()
  const { params: { postId }} = useMatch('/user/:userId/post/:postId')
  const queryClient = useQueryClient()

    const { data: post, isPending } = useQuery({
      queryKey: ['post', postId, token],
      queryFn: async () => {
        return loadPost( postId,token)
      }
    })

    const { mutate } = useMutation({
      mutationFn: async (text: string) => {
        return comment(user._id, token, postId, { text })
      },
      onMutate: async text => {
        await queryClient.cancelQueries({ queryKey: ['post', postId, token] })
  
        const previousPost = queryClient.getQueryData(['post', postId, token])
  
        queryClient.setQueryData(['post', postId, token], (post: TPost) => ({
          ...post,
          comments: [
            {
              _id: '123456',
              text,
              created: new Date(),
              postedBy: {
                _id: user._id,
                name: user.name,
                email: user.email
              }
            },
            ...post.comments
          ]
        }))
  
        return { previousPost }
      },
      onError: (_err, _newPost, context) => {
        queryClient.setQueryData(['post', postId, token], context.previousPost)
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: ['post'],
          refetchType: 'all'
        })
  
        queryClient.invalidateQueries({
          queryKey: ['newsfeed'],
          refetchType: 'all'
        })
  
        queryClient.invalidateQueries({
          queryKey: ['posts'],
          refetchType: 'all'
        })
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
            <Post commentMutation={mutate} post={post} showComments/>
          </MainLayout>
        </Card>
      </Grid>
      <Grid sx={{ p: 0, backgroundColor: "rgba(246, 247, 248, 0.5)"}} item lg={4}>
        <FindPeople />
      </Grid>
    </Grid>
  )
}
