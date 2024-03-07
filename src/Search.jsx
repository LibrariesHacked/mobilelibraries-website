import React from 'react'

import Typography from '@mui/material/Typography'

import PostcodeSearch from './PostcodeSearch'
import ServiceFilter from './ServiceFilter'

function Search () {
  return (
    <>
      <Typography color='secondary' component='h2' variant='h3'>
        Mobile libraries
      </Typography>
      <Typography component='p' variant='body1'>
        Search by postcode or library service
      </Typography>
      <div>
        <PostcodeSearch settings />
      </div>
      <ServiceFilter />
    </>
  )
}

export default Search
