import React from 'react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import PostcodeSearch from './PostcodeSearch'
import ServiceFilter from './ServiceFilter'

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
      <Typography color='text.primary' component='h1' variant='h4' gutterBottom>
        Mobile libraries
      </Typography>
      <Typography component='p' variant='subtitle1' color='text.secondary'>
        Find your nearest mobile library
      </Typography>
      <Box sx={{ my: 2 }}>
        <PostcodeSearch settings />
      </Box>
      <ServiceFilter />
    </Box>
  )
}

export default Search
