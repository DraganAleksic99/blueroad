import { useState, useEffect, useMemo, useCallback } from 'react'
import { useMatch } from 'react-router-dom'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { Paper } from '@mui/material'

import ProfileTabs from '../views/ProfileTabs'
import ProfileCard from '../components/ProfileCard'
import ProfileCardSkeleton from '../components/skeletons/ProfileCardSkeleton'

import { getUser } from '../services/userService'
import { loadPosts } from '../services/postService'
import auth, { Session } from '../utils/utils'
import { TPost } from '../routes/NewsFeed'
import { TFollowCallbackFn } from '../components/FollowProfileButton'

export type TUser = {
  _id: string
  name: string
  email: string
  password: string
  about: string
  created: Date
  photo: {
    data: Buffer
  }
  following: TUser[]
  followers: TUser[]
  bookmarkedPosts?: TPost[]
}

export default function Profile() {
  const queryClient = useQueryClient()
  const session: Session = useMemo(() => auth.isAuthenticated(), [])
  const [isFollowing, setIsFollowing] = useState<boolean>()
  const {
    params: { userId }
  } = useMatch('/profile/:userId')

  const { data: user, isLoading } = useQuery({
    queryKey: ['profile', userId, session],
    queryFn: async () => getUser(userId, session.token)
  })

  const { data: posts, isPending: arePostsPending } = useQuery({
    queryKey: ['posts', userId, session.token],
    queryFn: async () => loadPosts(userId, session.token)
  })

  const profileMutation = useMutation({
    mutationFn: (callbackFn: TFollowCallbackFn) => {
      return callbackFn(session.user._id, session.token, userId)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['usersToFollow'] })
      queryClient.invalidateQueries({ queryKey: ['newsfeed'], refetchType: 'inactive' })
      queryClient.invalidateQueries({ queryKey: ['discover'], refetchType: 'inactive' })
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

  return (
    <Paper elevation={2}>
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

      <ProfileTabs arePostsPending={arePostsPending} posts={posts} user={user} />
    </Paper>
  )
}
