import { Card, CardContent, Typography } from '@mui/material'
import MainLayout from './layouts/MainLayout'

export default function Home() {
  return (
    <Card>
      <MainLayout>
        <Typography variant="h3">Home Page</Typography>
        <CardContent>
          <Typography variant="h6" component="p">
            Welcome to the Social Media App home page
          </Typography>
        </CardContent>
      </MainLayout>
    </Card>
  )
}
