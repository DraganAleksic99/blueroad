import { defer } from 'react-router-dom'
import { useQuery, QueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Paper, Box } from '@mui/material'
import MainLayout from '../layouts/MainLayout'
import UserCard from '../components/UserCard'
import UserCardSkeleton from '../components/skeletons/UserCardSkeleton'
import { getUsers } from '../services/userService'

const usersQuery = () => ({
  queryKey: ['users'],
  queryFn: async () => getUsers()
})

// eslint-disable-next-line react-refresh/only-export-components
export const usersLoader = (queryClient: QueryClient) => async () => {
  const query = usersQuery()

  const queryPromise = queryClient.ensureQueryData(query)

  return defer({
    users: queryPromise
  })
}

export default function Users() {
  const { data: users, isPending } = useQuery(usersQuery())

  return (
    <Paper elevation={2}>
      <MainLayout>
        <Box sx={{ p: 3, pt: 0, columnCount: 3 }}>
          {isPending
            ? Array.from({ length: 12 }).map((_, i) => (
                <div key={i} style={{ display: 'inline-block', width: '100%', marginTop: '24px' }}>
                  <UserCardSkeleton />
                </div>
              ))
            : users.map(user => {
                return (
                  <Link
                    to={`/user/${user._id}`}
                    key={user._id}
                    style={{ display: 'inline-block', width: '100%', marginTop: '24px' }}
                  >
                    <UserCard user={user} />
                  </Link>
                )
              })}
        </Box>
      </MainLayout>
    </Paper>
  )
}
