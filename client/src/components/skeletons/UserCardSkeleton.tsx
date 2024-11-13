import { CardHeader, CardContent, CardActions, Skeleton, Divider } from '@mui/material'
import { StyledCard, InfoRow } from '../UserCard'

export default function UserCardSkeleton() {
  return (
    <StyledCard>
      <CardHeader
        sx={{ pb: 0 }}
        avatar={<Skeleton animation="wave" variant="circular" width={40} height={40} />}
        title={<Skeleton width="100%" sx={{ color: 'transparent', fontSize: "24px" }}>xxxxxxxx</Skeleton>}
        subheader={<Skeleton width="100%" sx={{ color: 'transparent' }}>xxxxxxxx</Skeleton>}
      />
      <CardContent sx={{ pb: 0, pl: '72px', pt: 0 }}>
        <InfoRow>
          <Skeleton width="100%" sx={{ color: 'transparent' }}>xxxxxxxxxxxxxxxxxx</Skeleton>
        </InfoRow>
        <Skeleton width="100%" sx={{ color: 'transparent', mb: 2 }}>
          xxxxxxxxxxxxxxxxx
        </Skeleton>
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pt: 2 }}>
        <Skeleton sx={{ color: 'transparent' }}>xxxxxxxxxxx</Skeleton>
        <Skeleton sx={{ color: 'transparent' }}>xxxxxxxxxxx</Skeleton>
      </CardActions>
    </StyledCard>
  )
}
