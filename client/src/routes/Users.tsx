import { defer } from 'react-router-dom'
import { useQuery, QueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  Paper,
  CardHeader,
  CardContent,
  CardActions,
  Skeleton,
  Box,
  Divider,
} from '@mui/material'
import MainLayout from '../layouts/MainLayout'
import UserCard, { StyledCard, InfoRow } from '../components/UserCard'
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

  if (isPending) {
    return (
      <Paper elevation={2}>
        <MainLayout>
          <Box sx={{ p: 3, pt: 3, columnCount: 3 }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <StyledCard sx={{ mb: 3 }} key={i}>
                <CardHeader
                  sx={{ pb: 0 }}
                  avatar={<Skeleton animation="wave" variant="circular" width={40} height={40} />}
                  title={<Skeleton sx={{ color: 'transparent' }}>xxxxxxxx</Skeleton>}
                  subheader={<Skeleton sx={{ color: 'transparent' }}>xxxxxxxx</Skeleton>}
                />
                <CardContent sx={{ pb: 0, pl: '72px', pt: 0 }}>
                  <InfoRow>
                    <Skeleton sx={{ color: 'transparent' }}>xxxxxxxxxxxxxxxxxx</Skeleton>
                  </InfoRow>
                  <Skeleton sx={{ color: 'transparent', mb: 2 }}>
                    xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                  </Skeleton>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pt: 2 }}>
                  <Skeleton sx={{ color: 'transparent' }}>xxxxxxxx</Skeleton>
                  <Skeleton sx={{ color: 'transparent' }}>xxxxxxx</Skeleton>
                </CardActions>
              </StyledCard>
            ))}
          </Box>
        </MainLayout>
      </Paper>
    )
  }

  return (
    <Paper elevation={2}>
      <MainLayout>
        <Box sx={{ p: 3, pt: 0, columnCount: 3 }}>
          {users.map(user => {
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
