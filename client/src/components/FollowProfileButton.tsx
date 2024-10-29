import { Button } from '@mui/material'
import { follow, unfollow } from '../services/userService'
import auth, { Jwt } from '../auth/authHelper'

type FollowFunction = typeof follow
type UnfollowFunction = typeof unfollow

type Props = {
  onButtonClick: (cb: FollowFunction | UnfollowFunction, jwt: Jwt) => void
  following: boolean
}

export default function FollowProfileButton({ onButtonClick, following }: Props) {
  const jwt: Jwt = auth.isAuthenticated()

  const followClick = () => {
    onButtonClick(follow, jwt)
  }

  const unfollowClick = () => {
    onButtonClick(unfollow, jwt)
  }

  return (
    <div>
      {following ? (
        <Button variant="contained" color="secondary" onClick={unfollowClick}>
          Unfollow
        </Button>
      ) : (
        <Button variant="contained" color="primary" onClick={followClick}>
          Follow
        </Button>
      )}
    </div>
  )
}
