import React from 'react'

import Box from '@mui/material/Box'

import Search from './Search'
import Stops from './Stops'

/**
 * Home page combining the postcode/service search header with the stops table.
 * @returns {JSX.Element} Home page component.
 */
const Home = () => {
  return (
    <Box sx={{ maxWidth: '100%' }}>
      <Search />
      <Stops />
    </Box>
  )
}

export default Home
