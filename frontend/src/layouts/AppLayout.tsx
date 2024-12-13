import { Outlet } from 'react-router-dom'
import { Box, Grid } from '@mui/material'
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

      <Grid
        item
        xs={24}
        sm={18}
        md={12}
        lg={12}
        sx={{
          height: '100%',
          overflowY: 'auto',
          scrollbarWidth: 'none',
          borderRight: '1px solid #e5e7eb'
        }}
      >
        <Outlet />
      </Grid>

      <Grid
        item
        lg={7}
        md={7}
        sx={{
          height: '100%',
          display: { xs: 'none', sm: 'none', md: 'block' },
          paddingLeft: {
            lg: '24px'
          }
        }}
      >
        <FindPeople />
        <Box width="100%" p={2}>
          <Box
            display="flex"
            justifyContent="space-between"
            fontSize="13px"
            color="rgb(33, 150, 243)"
          >
            <span className='text-underline'>Terms of Service</span>
            <span>•</span>
            <span className='text-underline'>Privacy Policy</span>
            <span>•</span>
            <span className='text-underline'>Cookie Policy</span>
          </Box>
        </Box>
      </Grid>
    </Grid>
  )
}
