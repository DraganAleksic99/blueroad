import { Box } from '@mui/material'
import { TUser } from '../views/Profile'
import GridCard from './GridCard'

export default function FollowGrid({ users = [] }: { users: TUser[] }) {
  return (
    <div>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {users.map((user, i) => {
          return (
            <Box sx={{ position: 'relative', flex: '0 0 32.31%' }} key={i}>
              <GridCard user={user} />
            </Box>
          )
        })}
      </Box>
    </div>
  )
}
