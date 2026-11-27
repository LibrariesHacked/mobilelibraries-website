import React, { Suspense, lazy, useEffect } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation
} from 'react-router-dom'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'

import Footer from './Footer'
import Home from './Home'
import Notification from './Notification'
import TripDetails from './TripDetails'

import Accessibility from './pages/accessibility.md'
import Data from './pages/data.md'
import Privacy from './pages/privacy.md'

import * as localAuthoritiesModel from './models/localAuthorities'
import * as mobilesModel from './models/mobiles'
import * as routesModel from './models/routes'

import { useApplicationStateValue } from './context/applicationState'
import { createLookup } from './helpers/utils'

const MemoMarkdownPage = lazy(() => import('./MarkdownPage'))

/** Active polling interval (30s) matching the API's 30s location cache and 60s route section window. */
const ACTIVE_POLL_INTERVAL_MS = 30000
/** Idle polling interval (5m) when no mobile libraries are currently active on the road. */
const IDLE_POLL_INTERVAL_MS = 300000

/**
 * Route-aware application layout that reserves the full viewport for the home map.
 *
 * @returns {JSX.Element} Application layout element.
 */
const ApplicationLayout = () => {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: isHome ? 0 : '100vh',
        height: isHome ? '100dvh' : undefined,
        overflow: isHome ? 'hidden' : undefined
      }}
    >
      <Container
        component='main'
        maxWidth={isHome ? false : 'xl'}
        disableGutters={isHome}
        sx={{
          flexGrow: 1,
          py: isHome ? 0 : 2,
          height: isHome ? '100%' : undefined,
          minHeight: isHome ? 0 : undefined
        }}
      >
        <Suspense fallback={null}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/mobiles' element={<Navigate to='/' replace />} />
            <Route path='/map' element={<Navigate to='/' replace />} />
            <Route
              path='/accessibility'
              element={<MemoMarkdownPage page={Accessibility} />}
            />
            <Route path='/data' element={<MemoMarkdownPage page={Data} />} />
            <Route
              path='/privacy'
              element={<MemoMarkdownPage page={Privacy} />}
            />
          </Routes>
        </Suspense>
      </Container>
      {!isHome && <Footer />}
      <TripDetails />
      <Notification />
    </Box>
  )
}

/**
 * Root application shell managing initial data loading, adaptive live location polling,
 * routing, and global notification/trip components.
 *
 * @returns {JSX.Element} Application shell element.
 */
const MobilesApplication = () => {
  const [, dispatchApplicationState] = useApplicationStateValue()

  useEffect(() => {
    let isMounted = true
    let timeoutId = null

    const scheduleNextPoll = locations => {
      if (!isMounted) return
      clearTimeout(timeoutId)
      if (document.hidden) return
      const hasActiveVehicles =
        Array.isArray(locations) && locations.some(loc => loc.isActive())
      const delay = hasActiveVehicles
        ? ACTIVE_POLL_INTERVAL_MS
        : IDLE_POLL_INTERVAL_MS
      timeoutId = setTimeout(pollMobileLocations, delay)
    }

    async function pollMobileLocations () {
      if (document.hidden) return
      const locations = await mobilesModel.getMobileLocations()
      if (!isMounted) return
      dispatchApplicationState({
        type: 'AddMobileLocations',
        mobileLocations: locations,
        mobileLocationLookup: createLookup(locations, 'mobileId')
      })
      scheduleNextPoll(locations)
    }

    async function loadInitialData () {
      const [localAuthorities, mobiles, routes, locations] = await Promise.all([
        localAuthoritiesModel.getAllLocalAuthorities(),
        mobilesModel.getAllMobiles(),
        routesModel.getAllRoutes(),
        mobilesModel.getMobileLocations()
      ])
      if (!isMounted) return

      dispatchApplicationState({
        type: 'InitializeApplicationData',
        localAuthorities,
        localAuthorityLookup: createLookup(localAuthorities),
        mobiles,
        mobileLookup: createLookup(mobiles),
        routes,
        routeLookup: createLookup(routes),
        mobileLocations: locations,
        mobileLocationLookup: createLookup(locations, 'mobileId')
      })
      scheduleNextPoll(locations)
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        pollMobileLocations()
      }
    }

    loadInitialData()
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [dispatchApplicationState])

  return (
    <BrowserRouter>
      <ApplicationLayout />
    </BrowserRouter>
  )
}

export default MobilesApplication
