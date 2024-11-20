import { useState, useEffect, useMemo, useCallback } from 'react'
import { useMatch } from 'react-router-dom'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { Paper } from '@mui/material'

import MainLayout from '../layouts/MainLayout'
import ProfileTabs from './ProfileTabs'
import ProfileCard from '../components/ProfileCard'
import ProfileCardSkeleton from '../components/skeletons/ProfileCardSkeleton'

import { getUser } from '../services/userService'
import { loadPosts } from '../services/postService'
import auth, { Jwt } from '../auth/authHelper'
import { TPost } from './post/NewsFeed'
import { TFollowCallbackFn } from '../components/FollowProfileButton'

export type TUser = {
  _id: string
  name: string
  email: string
  password: string
  about: string
  created: number
  photo: {
    data: Buffer
  }
  following: TUser[]
  followers: TUser[]
}

export default function Profile() {
  const queryClient = useQueryClient()
  const session: Jwt = useMemo(() => auth.isAuthenticated(), [])
  const [isFollowing, setIsFollowing] = useState<boolean>()
  const {
    params: { userId }
  } = useMatch('/user/:userId')

  const { data: user, isLoading } = useQuery({
    queryKey: ['profile', userId, session],
    queryFn: async () => getUser(userId, session.token)
  })

  const { data: posts, isPending: arePostsPending } = useQuery({
    queryKey: ['posts', userId, session],
    queryFn: async () => loadPosts(userId, session.token)
  })

  const profileMutation = useMutation({
    mutationFn: (callbackFn: TFollowCallbackFn) => {
      return callbackFn(session.user._id, session.token, userId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    }
  })

  const clickFollowButton = async (callbackFn: TFollowCallbackFn) => {
    profileMutation.mutate(callbackFn)
  }

  const checkFollow = useCallback(
    () => user?.followers?.some(follower => follower._id === session.user._id),
    [user, session]
  )

  useEffect(() => {
    const isFollowing = checkFollow()
    setIsFollowing(isFollowing)
  }, [checkFollow])

  const removePost = (post: TPost) => {
    const updatedPosts = [...posts]
    const index = updatedPosts.indexOf(post)
    updatedPosts.splice(index, 1)
  }

  return (
    <Paper elevation={4}>
      <MainLayout>
        {isLoading ? (
          <ProfileCardSkeleton />
        ) : (
          <ProfileCard
            user={user}
            posts={posts}
            isFollowing={isFollowing}
            isPending={profileMutation.isPending}
            clickFollowButton={clickFollowButton}
          />
        )}

        <ProfileTabs arePostsPending={arePostsPending} onRemove={removePost} posts={posts} user={user} />
      </MainLayout>
    </Paper>
  )
}
