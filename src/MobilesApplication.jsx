import React, { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'

import Header from './Header'
import Footer from './Footer'
import Mobiles from './Mobiles'
import MobileLibraryDetails from './MobileLibraryDetails'
import Notification from './Notification'
import Home from './Home'
import StopDetails from './StopDetails'
import TripDetails from './TripDetails'

import Accessibility from './pages/accessibility.md'
import Data from './pages/data.md'
import Privacy from './pages/privacy.md'

import * as mobilesModel from './models/mobiles'
import * as organisationsModel from './models/organisations'
import * as routesModel from './models/routes'

import { useApplicationStateValue } from './context/applicationState'

const MobileMap = lazy(() => import('./MobileMap'))
const MemoMarkdownPage = lazy(() => import('./MarkdownPage'))

const MobilesApplication = () => {
  const [{}, dispatchApplicationState] = useApplicationStateValue() //eslint-disable-line

  useEffect(() => {
    let isMounted = true

    async function loadInitialData () {
      const [organisations, mobiles, routes, locations] = await Promise.all([
        organisationsModel.getAllOrganisations(),
        mobilesModel.getAllMobiles(),
        routesModel.getAllRoutes(),
        mobilesModel.getMobileLocations()
      ])
      if (!isMounted) return

      const organisationLookup = {}
      organisations.forEach(organisation => {
        organisationLookup[organisation.id] = organisation
      })

      const mobileLookup = {}
      mobiles.forEach(mobile => {
        mobileLookup[mobile.id] = mobile
      })

      const routeLookup = {}
      routes.forEach(route => {
        routeLookup[route.id] = route
      })

      const mobileLocationLookup = {}
      locations.forEach(location => {
        mobileLocationLookup[location.mobileId] = location
      })

      dispatchApplicationState({
        type: 'InitializeApplicationData',
        organisations,
        organisationLookup,
        mobiles,
        mobileLookup,
        routes,
        routeLookup,
        mobileLocations: locations,
        mobileLocationLookup
      })
    }

    async function getMobileLocations () {
      if (document.hidden) return
      const locations = await mobilesModel.getMobileLocations()
      if (!isMounted) return
      const mobileLocationLookup = {}
      locations.forEach(location => {
        mobileLocationLookup[location.mobileId] = location
      })
      dispatchApplicationState({
        type: 'AddMobileLocations',
        mobileLocations: locations,
        mobileLocationLookup
      })
    }

    loadInitialData()

    const intervalId = setInterval(() => {
      getMobileLocations()
    }, 15000)

    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }, [dispatchApplicationState])

  return (
    <BrowserRouter>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh'
        }}
      >
        <Header />
        <Container component='main' maxWidth='lg' sx={{ flexGrow: 1, pb: 4 }}>
          <Suspense fallback={null}>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/mobiles' element={<Mobiles />} />
              <Route path='/map' element={<MobileMap />} />
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
        <Footer />
        <StopDetails />
        <MobileLibraryDetails />
        <TripDetails />
        <Notification />
      </Box>
    </BrowserRouter>
  )
}

export default MobilesApplication
