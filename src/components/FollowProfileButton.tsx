import { Button } from '@mui/material'
import { follow, unfollow } from '../services/userService'
import auth from '../auth/authHelper'

export default function FollowProfileButton({ onButtonClick, following }) {
  const jwt = auth.isAuthenticated()

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
