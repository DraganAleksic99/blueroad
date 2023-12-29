import { Card, CardContent, CardMedia, Typography } from '@mui/material'
import natureImg from './assets/nature.jpg'

export default function Home() {
  return (
    <Card>
      <Typography variant="h3">Home Page</Typography>
      <CardMedia image={natureImg} title="Nature" style={{ height: '70vh' }} />
      <CardContent>
        <Typography variant="h6" component="p">
          Welcome to the Social Media App home page
        </Typography>
      </CardContent>
    </Card>
  )
}
