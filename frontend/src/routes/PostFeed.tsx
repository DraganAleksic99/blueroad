import { useEffect } from 'react'
import { useMatch, useLocation } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, Grid } from '@mui/material'
import Post from '../views/post/Post'
import PostSkeleton from '../components/skeletons/PostSkeleton'
import SectionTitle from '../components/SectionTitle'
import auth, { Session } from '../utils/utils'
import { loadPost, comment } from '../services/postService'
import { TPost } from './NewsFeed'

export default function PostFeed() {
  const { pathname } = useLocation()
  const { user, token }: Session = auth.isAuthenticated()
  const {
    params: { postId }
  } = useMatch('/user/:userId/post/:postId')
  const queryClient = useQueryClient()

  const { data: post, isPending } = useQuery({
    queryKey: ['post', postId, token],
    queryFn: async () => {
      return loadPost(postId, token)
    }
  })

  const addCommentMutation = useMutation({
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

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <Grid container sx={{ borderRight: '1px solid #e5e7eb', minHeight: '100vh' }}>
      <Grid item sx={{ width: '100%' }}>
        <SectionTitle title='Post' />
        <Card elevation={0} sx={{ borderRadius: 0 }}>
          {isPending ? (
            <PostSkeleton />
          ) : (
            <Post commentMutation={addCommentMutation.mutate} post={post} showComments />
          )}
        </Card>
      </Grid>
    </Grid>
  )
}
