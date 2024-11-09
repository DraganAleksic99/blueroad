import { useLocation } from 'react-router-dom'
import {
  Card,
  Grid,
} from '@mui/material'
import MainLayout from '../../layouts/MainLayout'
import Post from './Post'
import FindPeople from '../FindPeople'

export default function PostFeed() {
    const post = useLocation().state

  return (
    <Grid container spacing={2}>
      <Grid item lg={8}>
        <Card>
          <MainLayout>
            <Post post={post} showComments/>
          </MainLayout>
        </Card>
      </Grid>
      <Grid sx={{ p: 0, backgroundColor: "rgba(246, 247, 248, 0.5)"}} item lg={4}>
        <FindPeople />
      </Grid>
    </Grid>
  )
}
