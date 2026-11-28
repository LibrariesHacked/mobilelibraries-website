import React, { lazy, Suspense } from 'react'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'

import Search from './Search'
import Stops from './Stops'

const MobileMap = lazy(() => import('./MobileMap'))

/**
 * Map-first workspace pairing the stop search and expandable stop list with the
 * interactive mobile library map and live vehicle tracker.
 *
 * @returns {JSX.Element} Home page component.
 */
const Home = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: 0,
        overflow: 'hidden'
      }}
    >
      <Suspense
        fallback={
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundColor: 'background.default'
            }}
          />
        }
      >
        <MobileMap />
      </Suspense>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none'
        }}
      >
        <Paper
          component='section'
          aria-label='Search and mobile library stops'
          elevation={0}
          sx={theme => ({
            position: 'absolute',
            left: { xs: 12, md: 16 },
            right: { xs: 12, md: 'auto' },
            top: { xs: 52, md: 'auto' },
            bottom: { xs: 'auto', md: 16 },
            zIndex: 4,
            width: { xs: 'auto', sm: 360, md: 420 },
            height: { xs: 'min(42dvh, 340px)', md: 'calc(100% - 80px)' },
            maxHeight: { xs: 'min(42dvh, 340px)', md: 'calc(100% - 80px)' },
            minHeight: { xs: 220, md: 0 },
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: 1,
            p: { xs: 1.5, md: 2 },
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.custom.floatingShadow,
            pointerEvents: 'auto'
          })}
        >
          <Search />
          <Box sx={{ flexGrow: 1, minHeight: 0 }}>
            <Stops />
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default Home
