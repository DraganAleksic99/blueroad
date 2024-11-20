import { Card, CardContent, Box, Skeleton } from '@mui/material'

export default function ProfileCardSkeleton() {
  return (
    <Card sx={{ display: 'flex', alignItems: 'center', gap: '50px', pb: 2 }}>
      <Skeleton
        variant="circular"
        animation="wave"
        sx={{ width: 150, height: 150, borderRadius: '50%', ml: '25%' }}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <CardContent sx={{ flex: '1 0 auto', pt: 3 }}>
          <Skeleton
            width="100%"
            animation="wave"
            sx={{ color: 'transparent', borderRadius: 1, fontSize: '1.2rem' }}
            variant="rectangular"
          >
            xxxxxxx
          </Skeleton>
          <Skeleton width="100%" animation="wave" sx={{ color: 'transparent', mt: 2 }}>
            xxxxxxx
          </Skeleton>
          <Box sx={{ display: 'flex', gap: '30px', pt: 2 }}>
            <div>
              <Skeleton animation="wave" sx={{ mr: 1, fontWeight: 600, color: 'transparent' }}>
                xxxxxxxxx
              </Skeleton>
            </div>
            <div>
              <Skeleton animation="wave" sx={{ mr: 1, fontWeight: 600, color: 'transparent' }}>
                xxxxxxxxx
              </Skeleton>
            </div>
            <div>
              <Skeleton animation="wave" sx={{ mr: 1, fontWeight: 600, color: 'transparent' }}>
                xxxxxxxxx
              </Skeleton>
            </div>
          </Box>
          <Skeleton
            width="100%"
            animation="wave"
            sx={{ mt: 3, color: 'transparent', borderRadius: 1 }}
            variant="rectangular"
          >
            xxxxxxxxxxxxxxxxxxxxxxxxx
          </Skeleton>
          <Skeleton
            width="100%"
            animation="wave"
            sx={{
              display: 'flex',
              alignItems: 'center',
              mt: 2,
              color: 'transparent',
              borderRadius: 1
            }}
            variant="rectangular"
          >
            xxxxxxxxxxxxxxxxx
          </Skeleton>
        </CardContent>
      </Box>
    </Card>
  )
}
