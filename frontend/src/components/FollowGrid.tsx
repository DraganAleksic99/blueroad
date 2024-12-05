import { Box } from '@mui/material'
import { TUser } from '../routes/Profile'
import GridCard from './GridCard'

export default function FollowGrid({ users = [] }: { users: TUser[] }) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      {users.map(user => {
        return (
          <Box sx={{ position: 'relative', flex: '0 0 100%' }} key={user._id}>
            <GridCard user={user} />
          </Box>
        )
      })}
    </Box>
  )
}
