import { Card, CardContent, Box, Skeleton } from '@mui/material'
import SectionTitle from '../SectionTitle'

export default function ProfileCardSkeleton() {
  return (
    <>
      <SectionTitle title="Profile" />
      <Card sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 2 }}>
        <Skeleton
          variant="circular"
          animation="wave"
          sx={{ width: 150, height: 150, borderRadius: '50%' }}
        />
        <Box
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1 1 auto' }}
        >
          <CardContent sx={{ width: '100%', p: 0 }}>
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
    </>
  )
}
