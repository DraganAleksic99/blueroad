import { Avatar, Typography, ImageList, ImageListItem } from '@mui/material'
import { Link } from 'react-router-dom'

const baseUrl = 'https://social-media-app-e2ia.onrender.com'

export default function FollowGrid({ users }) {
  return (
    <div>
      <ImageList rowHeight={160} cols={4}>
        {users.map((user, i: number) => {
          return (
            <ImageListItem style={{ height: 120 }} key={i}>
              <Link to={'/user/' + user._id}>
                <Avatar src={baseUrl + '/api/users/photo/' + user._id} sx={{ margin: 'auto' }} />
                <Typography sx={{ margin: 'auto', mt: '8px', width: 'fit-content' }}>
                  {user.name}
                </Typography>
              </Link>
            </ImageListItem>
          )
        })}
      </ImageList>
    </div>
  )
}
