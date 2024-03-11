import React from 'react'

import { Link, useLocation } from 'react-router-dom'

import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'

import AirportShuttleRoundedIcon from '@mui/icons-material/AirportShuttleRounded'
import ManageSearchRoundedIcon from '@mui/icons-material/ManageSearchRounded'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'

const Header = () => {
  const location = useLocation()

  return (
    <Box sx={{ flexGrow: 1, margin: theme => theme.spacing() }}>
      <Container>
        <Tabs value={location.pathname} centered>
          <Tab
            icon={<ManageSearchRoundedIcon />}
            iconPosition='start'
            label={'Find a stop'}
            value='/'
            component={Link}
            to='/'
          />
          <Tab
            icon={<AirportShuttleRoundedIcon />}
            iconPosition='start'
            label={'Library tracker'}
            value='/mobiles'
            component={Link}
            to='/mobiles'
          />
          <Tab
            icon={<PlaceRoundedIcon />}
            iconPosition='start'
            label={'Map'}
            value='/map'
            component={Link}
            to='/map'
          />
        </Tabs>
      </Container>
    </Box>
  )
}

export default Header
