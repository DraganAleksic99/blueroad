import { Button } from '@mui/material'
import { follow, unfollow } from '../services/userService'
import auth, { Jwt } from '../auth/authHelper'

type FollowFn = typeof follow
type UnfollowFn = typeof unfollow

export type TCallbackFn = FollowFn | UnfollowFn

type Props = {
  onButtonClick: (cb: TCallbackFn, session: Jwt) => void
  following: boolean
}

export default function FollowProfileButton({ onButtonClick, following }: Props) {
  const session: Jwt = auth.isAuthenticated()

  const followClick = () => {
    onButtonClick(follow, session)
  }

  const unfollowClick = () => {
    onButtonClick(unfollow, session)
  }

  return (
    <>
      {following ? (
        <Button
          variant="outlined"
          size="small"
          sx={{ ml: 4, px: 2, textTransform: 'none', borderRadius: '20px' }}
          onClick={unfollowClick}
        >
          Unfollow
        </Button>
      ) : (
        <Button
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
