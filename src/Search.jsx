import React from 'react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import PostcodeSearch from './PostcodeSearch'
import ServiceFilter from './ServiceFilter'

const Search = () => {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography
        color='secondary'
        component='h2'
        variant='h2'
        sx={{ marginTop: theme => theme.spacing(2) }}
      >
        Mobile libraries
      </Typography>
      <Typography component='p' variant='h6' color='primary'>
        Find your nearest mobile library stop
      </Typography>
      <Box sx={{ margin: theme => theme.spacing(2) }}>
        <PostcodeSearch settings />
      </Box>
      <ServiceFilter />
    </Box>
  )
}

export default Search
