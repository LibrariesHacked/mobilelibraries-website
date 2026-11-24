import React from 'react'

import Box from '@mui/material/Box'

import PostcodeSearch from './PostcodeSearch'
import ServiceFilter from './ServiceFilter'

/**
 * Clean, aligned header section combining the logo artwork,
 * the Geovation GB Names / postcode search input, and service filters.
 *
 * @returns {JSX.Element} Search panel component.
 */
const Search = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1.25
      }}
    >
      <Box
        component='h1'
        sx={{
          m: 0,
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
            maxWidth: 350,
            height: 'auto',
            display: 'block',
            filter: 'brightness(1.021)',
            mixBlendMode: 'multiply'
          }}
        />
      </Box>
      <PostcodeSearch />
      <ServiceFilter />
    </Box>
  )
}

export default Search
