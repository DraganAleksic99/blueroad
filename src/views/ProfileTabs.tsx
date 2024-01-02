import { useState } from 'react'
import { AppBar, Typography, Tabs, Tab } from '@mui/material'
import FollowGrid from '../components/FollowGrid'
// import PostList from './../post/PostList'
import { User } from './Profile'

type Props = {
  user: User | Record<string, never>
}

export default function ProfileTabs({ user }: Props) {
  const [tab, setTab] = useState(0)

  const handleTabChange = (event, value: number) => {
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
          variant="fullWidth"
        >
          <Tab label="Posts" />
          <Tab label="Following" />
          <Tab label="Followers" />
        </Tabs>
      </AppBar>
      {/* {tab === 0 && <TabContainer><PostList removeUpdate={props.removePostUpdate} posts={props.posts}/></TabContainer>} */}
      {tab === 1 && (
        <TabContainer>
          <FollowGrid users={user.following} />
        </TabContainer>
      )}
      {tab === 2 && (
        <TabContainer>
          <FollowGrid users={user.followers} />
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
