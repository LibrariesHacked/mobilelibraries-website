import React from 'react'

import Box from '@mui/material/Box'

import PostcodeSearch from './PostcodeSearch'

/**
 * Branded search header for the stop panel.
 *
 * @returns {JSX.Element} Search panel component.
 */
const Search = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1.25,
        flexShrink: 0,
        mb: 1.5
      }}
    >
      <Box
        component='h1'
        sx={{
          m: 0,
          display: { xs: 'none', md: 'flex' },
          justifyContent: 'center'
        }}
      >
        <Box
          component='img'
          src='/images/mobilelibraries-header.svg'
          alt='MobileLibraries — Opposite the willow tree'
          sx={{
            width: '100%',
            maxWidth: 320,
            height: 'auto',
            filter: 'brightness(1.021)',
            mixBlendMode: 'multiply'
          }}
        />
      </Box>
      <PostcodeSearch />
    </Box>
  )
}

export default Search
