import React from 'react'

import { Link, useMatch, useLocation } from 'react-router-dom'

import { Typography, alpha } from '@mui/material'

import grey from '@mui/material/colors/grey'

import AppBar from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Toolbar from '@mui/material/Toolbar'

import ListIcon from '@mui/icons-material/ViewListRounded'
import MapIcon from '@mui/icons-material/MapRounded'

function Header () {
  const location = useLocation()
  const mapPage = useMatch('/map')
  const servicePage = useMatch('/service/:service')

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        sx={{
          zIndex: theme => theme.zIndex.drawer + 1,
          backgroundColor: mapPage ? alpha(grey.A100, 0.8) : grey.A100
        }}
        elevation={0}
        position='relative'
        color='transparent'
      >
        <Container>
          <Toolbar>
            {!servicePage && (
              <>
                <Typography sx={{ textDecoration: 'underline' }}>
                  In development
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Tabs value={location.pathname}>
                  <Tab
                    icon={<ListIcon />}
                    iconPosition='start'
                    label={'List'}
                    value='/'
                    component={Link}
                    to='/'
                  />
                  <Tab
                    icon={<ListIcon />}
                    iconPosition='start'
                    label={'Vans'}
                    value='/'
                    component={Link}
                    to='/mobiles'
                  />
                  <Tab
                    icon={<MapIcon />}
                    iconPosition='start'
                    label={'Map'}
                    value='/map'
                    component={Link}
                    to='/map'
                  />
                </Tabs>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  )
}

export default Header
