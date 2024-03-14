import React from 'react'

import Box from '@mui/material/Box'

import Search from './Search'
import Stops from './Stops'

const Home = () => {
  return (
    <Box sx={{ maxWidth: '100%' }}>
      <Search />
      <Stops />
    </Box>
  )
}

export default Home
