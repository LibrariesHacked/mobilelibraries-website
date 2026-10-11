import React from 'react'

import { Link, useLocation } from 'react-router-dom'

import AppBar from '@mui/material/AppBar'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'

import AirportShuttleRoundedIcon from '@mui/icons-material/AirportShuttleRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'

const NAV_PATHS = ['/', '/mobiles', '/map']

/**
 * Top navigation pill bar allowing users to switch between Search, Tracker, and Map views.
 * @returns {JSX.Element} Header component.
 */
const Header = () => {
  const location = useLocation()
  const tabValue = NAV_PATHS.includes(location.pathname)
    ? location.pathname
    : false

  return (
    <AppBar component='nav' aria-label='Main navigation'>
      <Tabs value={tabValue} variant='scrollable'>
        <Tab
          icon={<SearchRoundedIcon fontSize='small' />}
          iconPosition='start'
          label='Search'
          value='/'
          component={Link}
          to='/'
        />
        <Tab
          icon={<AirportShuttleRoundedIcon fontSize='small' />}
          iconPosition='start'
          label='Tracker'
          value='/mobiles'
          component={Link}
          to='/mobiles'
        />
        <Tab
          icon={<PlaceRoundedIcon fontSize='small' />}
          iconPosition='start'
          label='Map'
          value='/map'
          component={Link}
          to='/map'
        />
      </Tabs>
    </AppBar>
  )
}

export default Header
