import { Card, CardContent, Typography } from '@mui/material'
// import FindPeople from './views/FindPeople'

export default function Home() {
  return (
    <Card>
      <Typography variant="h3">Home Page</Typography>
      {/* <FindPeople /> */}
      <CardContent>
        <Typography variant="h6" component="p">
          Welcome to the Social Media App home page
        </Typography>
      </CardContent>
    </Card>
  )
}
