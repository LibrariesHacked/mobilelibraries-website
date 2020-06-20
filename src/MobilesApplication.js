import React, { useEffect } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import Container from '@material-ui/core/Container'

import { makeStyles } from '@material-ui/core/styles'

import AppHeader from './AppHeader'
import Mobiles from './Mobiles'
import MobileMap from './MobileMap'
import Notification from './Notification'
import Stops from './Stops'
import StopDetails from './StopDetails'
import TripDetails from './TripDetails'

import * as mobilesModel from './models/mobiles'
import * as organisationsModel from './models/organisations'
import * as routesModel from './models/routes'

import { useApplicationStateValue } from './context/applicationState'

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
    async function getMobileLocations (showIndicator = true) {
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
        <AppHeader />
        <Container maxWidth='lg'>
          <main className={classes.content}>
            <Route path='/' exact render={() => <Mobiles />} />
            <Route path='/stops' render={() => <Stops />} />
            <Route path='/map' render={() => <MobileMap />} />
            <Route path={['/http:', '/https:']} component={props => { window.location.replace(props.location.pathname.substr(1)); return null }} />
          </main>
        </Container>
        <StopDetails />
        <TripDetails />
        <Notification />
      </div>
    </BrowserRouter>
  )
}

export default MobilesApplication
