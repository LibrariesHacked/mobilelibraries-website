import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Container from '@mui/material/Container'

import Header from './Header'
import Footer from './Footer'
import MemoMarkdownPage from './MarkdownPage'
import Mobiles from './Mobiles'
import MobileLibraryDetails from './MobileLibraryDetails'
import MobileMap from './MobileMap'
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
import { useViewStateValue } from './context/viewState'

const MobilesApplication = () => {
  const [
    {
      loadingOrganisations,
      loadingMobiles,
      loadingRoutes,
      loadingMobileLocations,
      loadingNearestMobiles,
      loadingPostcode
    }
  ] = useViewStateValue()
  const [{}, dispatchApplicationState] = useApplicationStateValue() //eslint-disable-line

  useEffect(() => {
    async function getOrganisations () {
      const organisations = await organisationsModel.getAllOrganisations()
      const organisationLookup = {}
      organisations.forEach(organisation => {
        organisationLookup[organisation.id] = organisation
      })
      dispatchApplicationState({
        type: 'AddOrganisations',
        organisations: organisations,
        organisationLookup: organisationLookup
      })
    }
    async function getMobiles () {
      const mobiles = await mobilesModel.getAllMobiles()
      const mobileLookup = {}
      mobiles.forEach(mobile => {
        mobileLookup[mobile.id] = mobile
      })
      dispatchApplicationState({
        type: 'AddMobiles',
        mobiles: mobiles,
        mobileLookup: mobileLookup
      })
    }
    async function getRoutes () {
      const routes = await routesModel.getAllRoutes()
      const routeLookup = {}
      routes.forEach(route => {
        routeLookup[route.id] = route
      })
      dispatchApplicationState({
        type: 'AddRoutes',
        routes: routes,
        routeLookup: routeLookup
      })
    }
    async function getMobileLocations () {
      const locations = await mobilesModel.getMobileLocations()
      const mobileLocationLookup = {}
      locations.forEach(location => {
        mobileLocationLookup[location.mobileId] = location
      })
      dispatchApplicationState({
        type: 'AddMobileLocations',
        mobileLocations: locations,
        mobileLocationLookup: mobileLocationLookup
      })
    }
    getOrganisations()
    getMobiles()
    getRoutes()
    getMobileLocations()

    setInterval(() => {
      getMobileLocations(false)
    }, 15000)
  }, []) //eslint-disable-line

  return (
    <BrowserRouter>
      <Header
        loading={
          loadingOrganisations ||
          loadingMobiles ||
          loadingRoutes ||
          loadingMobileLocations ||
          loadingNearestMobiles ||
          loadingPostcode
        }
      />
      <Container maxWidth='lg'>
        <main>
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
        </main>
      </Container>
      <Footer />
      <StopDetails />
      <MobileLibraryDetails />
      <TripDetails />
      <Notification />
    </BrowserRouter>
  )
}

export default MobilesApplication
