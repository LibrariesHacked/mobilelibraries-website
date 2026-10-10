import React from 'react'

import { Link, useLocation } from 'react-router-dom'

import Paper from '@mui/material/Paper'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'

import { alpha } from '@mui/material/styles'

import AirportShuttleRoundedIcon from '@mui/icons-material/AirportShuttleRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'

const Header = () => {
  const location = useLocation()
  const tabValue = ['/', '/mobiles', '/map'].includes(location.pathname)
    ? location.pathname
    : false

  return (
    <Paper
      component='header'
      variant='outlined'
      sx={{
        mt: 2,
        mb: 1,
        mx: 'auto',
        p: 0.5,
        width: 'fit-content',
        borderRadius: 3,
        zIndex: 1000,
        position: 'relative'
      }}
    >
      <Tabs
        value={tabValue}
        variant='scrollable'
        scrollButtons={false}
        sx={{
          minHeight: 40,
          '& .MuiTabs-indicator': {
            display: 'none'
          },
          '& .MuiTab-root': {
            minHeight: 40,
            py: 0.5,
            px: 2,
            borderRadius: 2.5,
            '&.Mui-selected': {
              backgroundColor: theme => alpha(theme.palette.primary.main, 0.1)
            }
          }
        }}
      >
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
    </Paper>
  )
}

export default Header
