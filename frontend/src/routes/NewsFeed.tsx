import { useState, SyntheticEvent } from 'react'
import { AppBar, Tabs, Tab, Box } from '@mui/material'
import FollowingNewsFeed from '../components/FollowingNewsFeed'
import DiscoverNewsFeed from '../components/DiscoverNewsFeed'
import { TUser } from './Profile'

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
  views: number
}

export default function NewsFeed() {
  const [currentTab, setCurrentTab] = useState(0)

  const handleTabChange = (_event: SyntheticEvent, value: number) => {
    setCurrentTab(value)
  }

  return (
    <Box>
      <AppBar
        elevation={0}
        sx={{
          borderRight: '1px solid #e5e7eb',
          borderBottom: '1px solid #e5e7eb',
          maxWidth: '640px',
          left: 'auto',
          right: 'auto'
        }}
        position="fixed"
        color="default"
      >
        <Tabs
          classes={{
            flexContainer: 'flexContainer',
            indicator: 'indicator'
          }}
          variant="fullWidth"
          value={currentTab}
          onChange={handleTabChange}
          sx={{
            '& .indicator': {
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              '& > span': {
                maxWidth: 70,
                width: '100%',
                backgroundColor: 'rgb(33, 150, 243)',
                borderRadius: '2px'
              }
            },
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
            children: <span />,
            sx: {
              height: '4px',
              borderRadius: '4px'
            }
          }}
        >
          <Tab label="Following" />
          <Tab label="Discover" />
        </Tabs>
      </AppBar>
      {currentTab === 0 && (
        <Box paddingTop="48px">
          <FollowingNewsFeed />
        </Box>
      )}
      {currentTab === 1 && (
        <Box paddingTop="48px">
          <DiscoverNewsFeed />
        </Box>
      )}
    </Box>
  )
}
