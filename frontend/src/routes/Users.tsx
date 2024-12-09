import { useEffect } from 'react'
import { defer, useLocation, Link } from 'react-router-dom'
import { useQuery, QueryClient } from '@tanstack/react-query'
import { Paper, Box } from '@mui/material'
import UserCard from '../components/UserCard'
import UserCardSkeleton from '../components/skeletons/UserCardSkeleton'
import SectionTitle from '../components/SectionTitle'
import { getUsers } from '../services/userService'

const usersQuery = () => ({
  queryKey: ['users'],
  queryFn: async () => getUsers(),
  staleTime: Infinity
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
  const { pathname } = useLocation()
  const { data: users, isPending } = useQuery(usersQuery())

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <Paper elevation={2} sx={{ borderRight: '1px solid #e5e7eb' }}>
      <SectionTitle title="Users" />
      <Box sx={{ p: 2, pt: 0, columnCount: 2 }}>
        {isPending
          ? Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ display: 'inline-block', width: '100%', marginTop: '16px' }}>
                <UserCardSkeleton />
              </div>
            ))
          : users.map(user => {
              return (
                <Link
                  to={`/profile/${user._id}`}
                  key={user._id}
                  style={{ display: 'inline-block', width: '100%', marginTop: '16px' }}
                >
                  <UserCard user={user} />
                </Link>
              )
            })}
      </Box>
    </Paper>
  )
}
