import { Outlet } from 'react-router-dom'
import { Grid } from '@mui/material'
import Navigation from '../components/Navigation'
import FindPeople from '../views/FindPeople'

export default function AppLayout() {
  return (
    <Grid container columns={24} sx={{ height: '100vh', overflow: 'hidden' }}>
      <Grid
        item
        sm={6}
        md={5}
        lg={5}
        sx={{
          backgroundColor: '#f5f5f5',
          display: {
            xs: 'none',
            sm: 'block',
            height: '100%',
            '&.MuiGrid-root': {
              paddingLeft: '0px'
            }
          }
        }}
      >
        <Navigation />
      </Grid>

      <Grid item xs={24} sm={18} md={12} lg={12} sx={{
        height: '100%', 
        overflowY: 'auto',
        scrollbarWidth: 'none'
      }} >
          <Outlet />
      </Grid>

      <Grid
        item
        lg={7}
        md={7}
        sx={{
          backgroundColor: '#f5f5f5',
          height: '100%',
          display: { xs: 'none', sm: 'none', md: 'block' },
          paddingLeft: {
            lg: '16px'
          }
        }}
      >
          <FindPeople />
      </Grid>
    </Grid>
  )
}
