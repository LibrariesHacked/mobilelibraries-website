import React from 'react'

import Box from '@mui/material/Box'

import PostcodeSearch from './PostcodeSearch'
import ServiceFilter from './ServiceFilter'

/**
 * Hero search section containing the header logo artwork, postcode search input, and service/mobile/route filters.
 * @returns {JSX.Element} Search section component.
 */
const Search = () => {
  return (
    <Box
      sx={{
        textAlign: 'center',
        mt: 1,
        mb: 3,
        width: '100%'
      }}
    >
      <Box
        component='h1'
        sx={{
          m: 0,
          mb: 1,
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box
          component='img'
          src='/images/mobilelibraries-header.svg'
          alt='MobileLibraries — Opposite the willow tree'
          sx={{
            width: '100%',
            maxWidth: { xs: 340, sm: 460, md: 520 },
            height: 'auto',
            display: 'block',
            filter: 'brightness(1.021)',
            mixBlendMode: 'multiply'
          }}
        />
      </Box>
      <Box sx={{ my: 2 }}>
        <PostcodeSearch />
      </Box>
      <ServiceFilter />
    </Box>
  )
}

export default Search
