import { Avatar, Typography, ImageList, ImageListItem } from '@mui/material'
import { Link } from 'react-router-dom'

const baseUrl = 'http://localhost:3500'

export default function FollowGrid({ users }) {
  return (
    <div>
      <ImageList rowHeight={160} cols={4}>
        {users.map((user, i: number) => {
          return (
            <ImageListItem style={{ height: 120 }} key={i}>
              <Link to={'/user/' + user._id}>
                <Avatar src={baseUrl + '/api/users/photo/' + user._id} />
                <Typography>{user.name}</Typography>
              </Link>
            </ImageListItem>
          )
        })}
      </ImageList>
    </div>
  )
}
