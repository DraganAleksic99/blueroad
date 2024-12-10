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

  const followClick = () => {
    onButtonClick(followUser, session)
  }

  const unfollowClick = () => {
    onButtonClick(unfollowUser, session)
  }

  return (
    <>
      {following ? (
        <Button
          disabled={isPending}
          variant="outlined"
          size="small"
          sx={{ ml: 4, px: 2, textTransform: 'none', borderRadius: '20px' }}
          onClick={unfollowClick}
        >
          Unfollow
        </Button>
      ) : (
        <Button
          disabled={isPending}
          variant="outlined"
          size="small"
          sx={{ ml: 4, px: 2, textTransform: 'none', borderRadius: '20px' }}
          onClick={followClick}
        >
          Follow
        </Button>
      )}
    </>
  )
}
