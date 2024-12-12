import { Button } from '@mui/material'
import { followUser, unfollowUser } from '../services/userService'
import auth, { Session } from '../utils/utils'

type FollowFn = typeof followUser
type UnfollowFn = typeof unfollowUser

export type TFollowCallbackFn = FollowFn | UnfollowFn

type Props = {
  onButtonClick: (cb: TFollowCallbackFn, session: Session) => void
  following: boolean
  isPending: boolean
}

export default function FollowProfileButton({ onButtonClick, following, isPending }: Props) {
  const session: Session = auth.isAuthenticated()

  const handleFollow = () => {
    onButtonClick(followUser, session)
  }

  const handleUnfollow = () => {
    onButtonClick(unfollowUser, session)
  }

  return (
    <>
      {following ? (
        <Button
          variant="outlined"
          size="small"
          disabled={isPending}
          onClick={handleUnfollow}
          data-following="Following"
          data-unfollow="Unfollow"
          sx={{
            border: '1px solid rgb(33, 150, 243)',
            color: 'rgb(33, 150, 243)',
            px: 2,
            py: '4px',
            textTransform: 'none',
            borderRadius: '20px',
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            '&::before': {
              content: 'attr(data-following)'
            },
            '&:hover, &.Mui-disabled': {
              px: '18.5px',
              color: 'rgb(249, 24, 128)',
              backgroundColor: 'rgba(249, 24, 128, 0.1)',
              borderColor: 'rgb(249, 24, 128)',
              '&::before': {
                content: 'attr(data-unfollow)'
              }
            },
            '&.Mui-disabled': {
              opacity: 0.5,
              pointerEvents: 'none'
            }
          }}
        />
      ) : (
        <Button
          disabled={isPending}
          variant="outlined"
          size="small"
          sx={{
            ml: 4,
            px: 2,
            textTransform: 'none',
            borderRadius: '20px',
            border: '1px solid rgb(33, 150, 243)',
            color: 'rgb(33, 150, 243)'
          }}
          onClick={handleFollow}
        >
          Follow
        </Button>
      )}
    </>
  )
}
