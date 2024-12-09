import { SyntheticEvent, useState, useEffect } from 'react'
import { useMatch } from 'react-router-dom'
import { AppBar, Tabs, Tab, Box } from '@mui/material'
import FollowGrid from '../components/FollowGrid'
import PostList from './post/PostList'
import { TUser } from '../routes/Profile'
import { TPost } from '../routes/NewsFeed'

type Props = {
  user: TUser | Record<string, never>
  posts: TPost[]
  arePostsPending: boolean
}

export default function ProfileTabs({ user = {}, posts = [], arePostsPending }: Props) {
  const [currentTab, setCurrentTab] = useState(0)
  const {
    params: { userId }
  } = useMatch('/profile/:userId')

  const handleTabChange = (_event: SyntheticEvent, value: number) => {
    setCurrentTab(value)
  }

  useEffect(() => setCurrentTab(0), [userId])

  return (
    <div>
      <AppBar
        sx={{ borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}
        elevation={0}
        position="static"
        color="default"
      >
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          sx={{
            '& .MuiButtonBase-root': {
              textTransform: 'none',
              fontSize: '1rem',
              px: '30px'
            },
            '& .MuiButtonBase-root:hover': {
              backgroundColor: 'rgba(33, 150, 243, 0.1)'
            },
            '& .Mui-selected': {
              color: 'rgb(33, 150, 243)',
              fontWeight: 'bold'
            }
          }}
          centered
          TabIndicatorProps={{
            sx: {
              height: '4px',
              borderRadius: '2px',
              backgroundColor: 'rgb(33, 150, 243)'
            }
          }}
        >
          <Tab label="Posts" />
          <Tab label="Followers" />
          <Tab label="Following" />
        </Tabs>
      </AppBar>
      {currentTab === 0 && (
        <Box sx={{ pt: '2px' }}>
          <PostList arePostsPending={arePostsPending} posts={posts} />
        </Box>
      )}
      {currentTab === 1 && (
        <Box sx={{ pt: '2px' }}>
          <FollowGrid users={user.followers} />
        </Box>
      )}
      {currentTab === 2 && (
        <Box sx={{ pt: '2px' }}>
          <FollowGrid users={user.following} />
        </Box>
      )}
    </div>
  )
}
