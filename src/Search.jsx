import React from 'react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import PostcodeSearch from './PostcodeSearch'
import ServiceFilter from './ServiceFilter'

/**
 * Hero search section containing the page heading, postcode search input, and service/mobile/route filters.
 * @returns {JSX.Element} Search section component.
 */
const Search = () => {
  return (
    <Box
      sx={{
        textAlign: 'center',
        mt: 2,
        mb: 3,
        width: '100%'
      }}
    >
      <Typography component='h1' variant='h4' gutterBottom>
        Mobile libraries
      </Typography>
      <Typography component='p' variant='subtitle1'>
        Find your nearest mobile library
      </Typography>
      <Box sx={{ my: 2 }}>
        <PostcodeSearch />
      </Box>
      <ServiceFilter />
    </Box>
  )
}

export default Search
