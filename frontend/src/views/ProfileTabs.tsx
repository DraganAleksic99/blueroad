import { SyntheticEvent, useState, PropsWithChildren, useEffect } from 'react'
import { useMatch } from 'react-router-dom'
import { AppBar, Typography, Tabs, Tab } from '@mui/material'
import FollowGrid from '../components/FollowGrid'
import PostList from './post/PostList'
import { TUser } from '../routes/Profile'
import { TPost } from '../routes/NewsFeed'

type Props = {
  user: TUser | Record<string, never>
  posts: TPost[]
  onRemove: (post: TPost) => void
  arePostsPending: boolean
}

export default function ProfileTabs({ user = {}, posts = [], onRemove, arePostsPending }: Props) {
  const [currentTab, setCurrentTab] = useState(0)
  const {
    params: { userId }
  } = useMatch('/user/:userId')

  const handleTabChange = (_event: SyntheticEvent, value: number) => {
    setCurrentTab(value)
  }

  useEffect(() => setCurrentTab(0), [userId])

  return (
    <div>
      <AppBar position="static" color="default">
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Posts" />
          <Tab label="Followers" />
          <Tab label="Following" />
        </Tabs>
      </AppBar>
      {currentTab === 0 && (
        <TabContainer>
          <PostList arePostsPending={arePostsPending} removePost={onRemove} posts={posts} />
        </TabContainer>
      )}
      {currentTab === 1 && (
        <TabContainer>
          <FollowGrid users={user.followers} />
        </TabContainer>
      )}
      {currentTab === 2 && (
        <TabContainer>
          <FollowGrid users={user.following} />
        </TabContainer>
      )}
    </div>
  )
}

const TabContainer = ({ children } : PropsWithChildren) => {
  return (
    <Typography component="div" style={{ padding: 8 * 2 }}>
      {children}
    </Typography>
  )
}
