// React
import React, { useState, useEffect } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

// Material UI
import Container from '@material-ui/core/Container'

// Styling
import { makeStyles } from '@material-ui/core/styles'

// Our components
import AppHeader from './AppHeader'
import Mobiles from './Mobiles'
import MobileMap from './MobileMap'
import Notification from './Notification'
import Stops from './Stops'
import StopDetails from './StopDetails'
import TripDetails from './TripDetails'

// Our helpers
import * as geoHelper from './helpers/geo'
import * as mobilesHelper from './helpers/mobiles'
import * as organisationsHelper from './helpers/organisations'
import * as routesHelper from './helpers/routes'
import * as stopsHelper from './helpers/stops'
import * as tripsHelper from './helpers/trips'

import { useApplicationStateValue } from './context/state'

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
  const [applicationState, dispatch] = useApplicationStateValue() //eslint-disable-line

  const [currentStop, setCurrentStop] = useState({})
  const [stopDialogOpen, setStopDialogOpen] = useState(false)

  const [currentTrip, setCurrentTrip] = useState({})
  const [tripDialogOpen, setTripDialogOpen] = useState(false)

  const [organisationFilter, setOrganisationFilter] = useState([])
  const [mobileFilter, setMobileFilter] = useState([])
  const [mobilesNearestLookup, setMobilesNearestLookup] = useState({})

  const [routeFilter, setRouteFilter] = useState([])

  const [position, setPosition] = useState([-2.1000, 53.6138])
  const [zoom, setZoom] = useState([7])
  const [searchType, setSearchType] = useState('')
  const [distance, setDistance] = useState(1609)
  const [postcode, setPostcode] = useState('')
  const [currentPosition, setCurrentPosition] = useState([])
  const [positionUpdateInterval, setPositionUpdateInterval] = useState('')
  const [mapSettings, setMapSettings] = useState({ authorityBoundary: false })

  const [loadingGPS, setLoadingGPS] = useState(false)
  const [loadingMobiles, setLoadingMobiles] = useState(false)
  const [loadingMobileLocations, setLoadingMobileLocations] = useState(false)
  const [loadingOrganisations, setLoadingOrganisations] = useState(false)
  const [loadingPostcode, setLoadingPostcode] = useState(false)
  const [loadingRoutes, setLoadingRoutes] = useState(false)

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState(false)

  const getMobilesNearest = async () => {
    const mobilesNearest = await mobilesHelper.getMobilesNearest(currentPosition, distance)
    const mobilesNearestLookup = {}
    mobilesNearest.forEach(mobile => { mobilesNearestLookup[mobile.mobileId] = mobile })
    setMobilesNearestLookup(mobilesNearestLookup)
  }

  useEffect(() => {
    async function getOrganisations () {
      setLoadingOrganisations(true)
      const organisations = await organisationsHelper.getAllOrganisations()
      const organisationLookup = {}
      organisations.forEach(organisation => { organisationLookup[organisation.id] = organisation })
      dispatch({ type: 'AddOrganisations', organisations: organisations, organisationLookup: organisationLookup })
      setLoadingOrganisations(false)
    }
    async function getMobiles () {
      setLoadingMobiles(true)
      const mobiles = await mobilesHelper.getAllMobiles()
      const mobileLookup = {}
      mobiles.forEach(mobile => { mobileLookup[mobile.id] = mobile })
      dispatch({ type: 'AddMobiles', mobiles: mobiles, mobileLookup: mobileLookup })
      setLoadingMobiles(false)
    }
    async function getRoutes () {
      setLoadingRoutes(true)
      const routes = await routesHelper.getAllRoutes()
      const routeLookup = {}
      routes.forEach(route => { routeLookup[route.id] = route })
      dispatch({ type: 'AddRoutes', routes: routes, routeLookup: routeLookup })
      setLoadingRoutes(false)
    }
    async function getMobileLocations (showIndicator = true) {
      if (showIndicator) setLoadingMobileLocations(true)
      const locations = await mobilesHelper.getMobileLocations()
      const mobileLocationLookup = {}
      locations.forEach(location => { mobileLocationLookup[location.mobileId] = location })
      dispatch({ type: 'AddMobileLocations', mobileLocations: locations, mobileLocationLookup: mobileLocationLookup })
      if (showIndicator) setLoadingMobileLocations(false)
    }
    getOrganisations()
    getMobiles()
    getRoutes()
    getMobileLocations()

    setInterval(() => {
      getMobileLocations(false)
    }, 15000)
  }, []) //eslint-disable-line

  const viewStop = async (stop) => {
    openStopDialog(stop)
    if (!stop.name) {
      const stopData = await stopsHelper.getStopById(stop.id)
      setCurrentStop(stopData)
    }
  }

  const openStopDialog = (stop) => {
    setCurrentStop(stop)
    setStopDialogOpen(true)
  }

  const viewTrip = async (trip) => {
    openTripDialog(trip)
    const tripData = await tripsHelper.getTripById(trip.id)
    setCurrentTrip(tripData)
  }

  const openTripDialog = (trip) => {
    setCurrentTrip(trip)
    setTripDialogOpen(true)
  }

  const viewStopsByOrganisation = (organisationId) => {
    setOrganisationFilter([organisationId])
    setMobileFilter([])
    setRouteFilter()
  }

  const viewStopsByMobile = (organisationId, mobileId) => {
    setOrganisationFilter([organisationId])
    setMobileFilter([mobileId])
    setRouteFilter([])
  }

  const viewStopsByRoute = (organisationId, mobileId, routeId) => {
    setOrganisationFilter([organisationId])
    setMobileFilter([mobileId])
    setRouteFilter([routeId])
  }

  const clearMobileFilter = () => {
    setMobileFilter([])
    setRouteFilter([])
  }

  const clearRouteFilter = () => setRouteFilter([])

  const clearOrganisationFilter = () => {
    setOrganisationFilter([])
    setMobileFilter([])
    setRouteFilter([])
  }

  const viewMapStop = (longitude, latitude) => {
    setPosition([longitude, latitude])
    setZoom([15])
    setStopDialogOpen(false)
  }

  const viewMapTrip = (longitude, latitude) => {
    setPosition([longitude, latitude])
    setZoom([14])
    setTripDialogOpen(false)
  }

  const logPosition = async (fit = false) => {
    setLoadingGPS(true)
    const position = await geoHelper.getCurrentPosition()
    if (position.length === 2) {
      getMobilesNearest()
      setCurrentPosition(position)
      setPosition(position)
      setZoom([12])
      setLoadingGPS(false)
    } else {
      clearInterval(positionUpdateInterval)
      setSearchType('')
      setPostcode('')
      setCurrentPosition([])
      setPositionUpdateInterval(null)
      setSnackbarMessage('Could not fetch current location')
      setSnackbarOpen(true)
    }
  }

  const clearSearch = () => {
    setPostcode('')
    setCurrentPosition([])
    setSearchType('')
    setOrganisationFilter([])
    setMobileFilter([])
    setRouteFilter([])
  }

  const postcodeSearch = async (postcode) => {
    if (postcode === '') {
      setSnackbarOpen(true)
      setSnackbarMessage('You must enter a postcode')
      return
    }

    setSearchType('postcode')
    setLoadingPostcode(true)
    setPostcode(postcode)
    setOrganisationFilter([])
    setMobileFilter([])
    setRouteFilter([])

    if (searchType === 'gps') {
      clearInterval(positionUpdateInterval)
      setPositionUpdateInterval(null)
    }

    const postcodeData = await geoHelper.getPostcode(postcode)
    if (postcodeData.location && postcodeData.location.length === 2) {
      setCurrentPosition(postcodeData.location)
      setPosition(postcodeData.location)
      setZoom([11])
      setLoadingPostcode(false)
      getMobilesNearest()
    } else {
      setSnackbarOpen(true)
      setSnackbarMessage('Could not find postcode')
    }
  }

  const toggleGPS = () => {
    if (searchType === 'gps') {
      clearInterval(positionUpdateInterval)
      setSearchType('')
      setCurrentPosition([])
      setPositionUpdateInterval(null)
    } else {
      const positionUpdateInterval = setInterval(logPosition, 15000)
      setPositionUpdateInterval(positionUpdateInterval)
      setSearchType('gps')
      setPostcode('')
      setOrganisationFilter([])
      setMobileFilter([])
      setRouteFilter([])
      logPosition(true)
    }
  }

  const toggleMapSetting = (setting) => {
    const newMapSettings = mapSettings
    const currentSetting = mapSettings[setting]
    newMapSettings[setting] = !currentSetting
    setMapSettings(newMapSettings)
  }

  const closeSnackbar = (event, reason) => {
    if (reason === 'clickaway') return
    setSnackbarOpen(false)
  }

  const classes = useStyles()

  return (
    <BrowserRouter>
      <div className={classes.root}>
        <AppHeader
          loading={loadingMobiles || loadingMobileLocations || loadingOrganisations || loadingRoutes || loadingPostcode || loadingGPS}
          postcode={postcode}
          distance={distance}
          searchType={searchType}
          setDistance={setDistance}
          toggleGPS={toggleGPS}
          postcodeSearch={postcodeSearch}
          clearSearch={clearSearch}
        />
        <Container maxWidth='lg'>
          <main className={classes.content}>
            <Route
              path='/'
              exact
              render={() => {
                return (
                  <Mobiles
                    mobilesNearestLookup={mobilesNearestLookup}
                    loadingMobileLocations={loadingMobileLocations}
                    viewStop={viewStop}
                    viewStopsByMobile={viewStopsByMobile}
                    viewStopsByRoute={viewStopsByRoute}
                    viewStopsByOrganisation={viewStopsByOrganisation}
                    organisationFilter={organisationFilter}
                    setOrganisationFilter={(organisationId) => { setOrganisationFilter([organisationId]) }}
                    clearOrganisationFilter={clearOrganisationFilter}
                    mobileFilter={mobileFilter}
                    setMobileFilter={(mobileId) => setMobileFilter([mobileId])}
                    clearMobileFilter={clearMobileFilter}
                    routeFilter={routeFilter}
                    setRouteFilter={(routeId) => { setRouteFilter([routeId]) }}
                    clearRouteFilter={clearRouteFilter}
                    postcode={postcode}
                    distance={distance}
                    searchType={searchType}
                    setDistance={setDistance}
                    toggleGPS={toggleGPS}
                    postcodeSearch={postcodeSearch}
                    clearSearch={clearSearch}
                  />)
              }}
            />
            <Route
              path='/stops'
              render={() => {
                return (
                  <Stops
                    organisationFilter={organisationFilter}
                    setOrganisationFilter={(organisationId) => { setOrganisationFilter([organisationId]) }}
                    clearOrganisationFilter={clearOrganisationFilter}
                    mobileFilter={mobileFilter}
                    setMobileFilter={(mobileId) => { setMobileFilter([mobileId]) }}
                    clearMobileFilter={clearMobileFilter}
                    routeFilter={routeFilter}
                    setRouteFilter={(routeId) => { setRouteFilter([routeId]) }}
                    clearRouteFilter={clearRouteFilter}
                    viewStop={viewStop}
                    viewMapStop={viewMapStop}
                    currentPosition={currentPosition}
                    postcode={postcode}
                    distance={distance}
                    searchType={searchType}
                    setDistance={setDistance}
                    toggleGPS={toggleGPS}
                    postcodeSearch={postcodeSearch}
                    clearSearch={clearSearch}
                  />)
              }}
            />
            <Route
              path='/map'
              render={() => {
                return (
                  <MobileMap
                    position={position}
                    currentPosition={currentPosition}
                    zoom={zoom}
                    searchType={searchType}
                    mapSettings={mapSettings}
                    toggleMapSetting={toggleMapSetting}
                    viewStop={viewStop}
                    viewTrip={viewTrip}
                  />)
              }}
            />
          </main>
        </Container>
        <StopDetails
          stop={currentStop}
          open={stopDialogOpen}
          close={() => setStopDialogOpen(false)}
          viewMapStop={viewMapStop}
        />
        <TripDetails
          trip={currentTrip}
          open={tripDialogOpen}
          close={() => setTripDialogOpen(false)}
          viewMapTrip={viewMapTrip}
        />
        <Notification
          open={snackbarOpen}
          close={closeSnackbar}
          message={snackbarMessage}
        />
      </div>
    </BrowserRouter>
  )
}

export default MobilesApplication
