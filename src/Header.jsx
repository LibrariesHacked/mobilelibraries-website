import React from 'react'

import { Link, useLocation } from 'react-router-dom'

import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'

import { lighten } from '@mui/material'

import AirportShuttleRoundedIcon from '@mui/icons-material/AirportShuttleRounded'
import ManageSearchRoundedIcon from '@mui/icons-material/ManageSearchRounded'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'

const Header = () => {
  const location = useLocation()

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        marginTop: theme => theme.spacing(1),
        marginBottom: theme => theme.spacing(1),
        width: '320px',
        marginLeft: 'auto',
        marginRight: 'auto',
        border: '2px solid',
        borderColor: theme => theme.palette.primary.main,
        borderRadius: 2,
        zIndex: 1000,
        position: 'relative'
      }}
    >
      <Tabs
        value={location.pathname}
        variant='scrollable'
        scrollButtons={false}
        sx={{
          '& .MuiTabs-indicator': {
            display: 'none'
          },
          padding: '2px'
        }}
      >
        <Tab
          icon={<ManageSearchRoundedIcon />}
          iconPosition='start'
          label='Search'
          value='/'
          component={Link}
          to='/'
          sx={{
            '&.Mui-selected': {
              backgroundColor: theme => lighten(theme.palette.primary.main, 0.9)
            }
          }}
        />
        <Tab
          icon={<AirportShuttleRoundedIcon />}
          iconPosition='start'
          label='Tracker'
          value='/mobiles'
          component={Link}
          to='/mobiles'
          sx={{
            '&.Mui-selected': {
              backgroundColor: theme =>
                lighten(theme.palette.primary.main, 0.9),
              borderRadius: 2
            }
          }}
        />
        <Tab
          icon={<PlaceRoundedIcon />}
          iconPosition='start'
          label='Map'
          value='/map'
          component={Link}
          to='/map'
          sx={{
            '&.Mui-selected': {
              backgroundColor: theme =>
                lighten(theme.palette.primary.main, 0.9),
              borderRadius: 2
            }
          }}
        />
      </Tabs>
    </Box>
  )
}

export default Header
