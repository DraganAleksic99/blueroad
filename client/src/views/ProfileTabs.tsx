import { SyntheticEvent, useState } from 'react'
import { AppBar, Typography, Tabs, Tab } from '@mui/material'
import FollowGrid from '../components/FollowGrid'
import PostList from './post/PostList'
import { TUser } from './Profile'
import { TPost } from './post/NewsFeed'

type Props = {
  user: TUser | Record<string, never>
  posts: TPost[]
  onRemove: (post: TPost) => void
}

export default function ProfileTabs({ user, posts, onRemove }: Props) {
  const [tab, setTab] = useState(0)

  const handleTabChange = (_event: SyntheticEvent, value: number) => {
    setTab(value)
  }

  return (
    <div>
      <AppBar position="static" color="default">
        <Tabs
          value={tab}
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
      {tab === 0 && (
        <TabContainer>
          <PostList removePost={onRemove} posts={posts} />
        </TabContainer>
      )}
      {tab === 1 && (
        <TabContainer>
          <FollowGrid users={user.followers} />
        </TabContainer>
      )}
      {tab === 2 && (
        <TabContainer>
          <FollowGrid users={user.following} />
        </TabContainer>
      )}
    </div>
  )
}

const TabContainer = ({ children }) => {
  return (
    <Typography component="div" style={{ padding: 8 * 2 }}>
      {children}
    </Typography>
  )
}
