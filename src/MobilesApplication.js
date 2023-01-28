import React, { useEffect } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import Container from '@mui/material/Container'

import makeStyles from '@mui/styles/makeStyles'

import AppHeader from './AppHeader'
import Footer from './Footer'
import { MemoMarkdownPage } from './MarkdownPage'
import Mobiles from './Mobiles'
import MobileLibraryDetails from './MobileLibraryDetails'
import MobileMap from './MobileMap'
import Notification from './Notification'
import Stops from './Stops'
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

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(2)
  },
  root: {
    flexGrow: 1
  }
}))

function MobilesApplication () {
  const [{ loadingOrganisations, loadingMobiles, loadingRoutes, loadingMobileLocations, loadingNearestMobiles, loadingPostcode }] = useViewStateValue()
  const [{ }, dispatchApplicationState] = useApplicationStateValue() //eslint-disable-line

  useEffect(() => {
    async function getOrganisations () {
      const organisations = await organisationsModel.getAllOrganisations()
      const organisationLookup = {}
      organisations.forEach(organisation => { organisationLookup[organisation.id] = organisation })
      dispatchApplicationState({ type: 'AddOrganisations', organisations: organisations, organisationLookup: organisationLookup })
    }
    async function getMobiles () {
      const mobiles = await mobilesModel.getAllMobiles()
      const mobileLookup = {}
      mobiles.forEach(mobile => { mobileLookup[mobile.id] = mobile })
      dispatchApplicationState({ type: 'AddMobiles', mobiles: mobiles, mobileLookup: mobileLookup })
    }
    async function getRoutes () {
      const routes = await routesModel.getAllRoutes()
      const routeLookup = {}
      routes.forEach(route => { routeLookup[route.id] = route })
      dispatchApplicationState({ type: 'AddRoutes', routes: routes, routeLookup: routeLookup })
    }
    async function getMobileLocations () {
      const locations = await mobilesModel.getMobileLocations()
      const mobileLocationLookup = {}
      locations.forEach(location => { mobileLocationLookup[location.mobileId] = location })
      dispatchApplicationState({ type: 'AddMobileLocations', mobileLocations: locations, mobileLocationLookup: mobileLocationLookup })
    }
    getOrganisations()
    getMobiles()
    getRoutes()
    getMobileLocations()

    setInterval(() => {
      getMobileLocations(false)
    }, 15000)
  }, []) //eslint-disable-line

  const classes = useStyles()

  return (
    <BrowserRouter>
      <div className={classes.root}>
        <AppHeader
          loading={loadingOrganisations || loadingMobiles || loadingRoutes || loadingMobileLocations || loadingNearestMobiles || loadingPostcode}
          site={2}
        />
        <Container maxWidth='lg'>
          <main className={classes.content}>
            <Route path='/' exact render={() => <Stops />} />
            <Route path='/mobiles' render={() => <Mobiles />} />
            <Route path='/map' render={() => <MobileMap />} />
            <Route path='/accessibility' exact render={() => <MemoMarkdownPage page={Accessibility} />} />
            <Route path='/data' exact render={() => <MemoMarkdownPage page={Data} />} />
            <Route path='/privacy' exact render={() => <MemoMarkdownPage page={Privacy} />} />
            <Route path={['/http:', '/https:']} component={props => { window.location.replace(props.location.pathname.substr(1)); return null }} />
          </main>
        </Container>
        <Container maxWidth='lg'>
          <Footer />
        </Container>
        <StopDetails />
        <MobileLibraryDetails />
        <TripDetails />
        <Notification />
      </div>
    </BrowserRouter>
  )
}

export default MobilesApplication
