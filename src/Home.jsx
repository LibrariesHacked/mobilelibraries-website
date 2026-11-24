import React from 'react'

import Box from '@mui/material/Box'

import MobileMap from './MobileMap'
import Search from './Search'
import Stops from './Stops'

/**
 * Unified single-page workspace pairing the stop search and expandable stop cards
 * panel alongside the interactive mobile library map and live vehicle tracker.
 *
 * @returns {JSX.Element} Home page component.
 */
const Home = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2.5,
        alignItems: 'stretch',
        minHeight: { md: 'calc(100vh - 88px)' }
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', md: 420, lg: 450 },
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Search />
        <Stops />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
          display: 'flex',
          minHeight: { xs: 460, md: 'auto' }
        }}
      >
        <MobileMap />
      </Box>
    </Box>
  )
}

export default Home
