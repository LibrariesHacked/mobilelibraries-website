// React
import React, { useState, useEffect } from 'react'

// Other core stuff
import PropTypes from 'prop-types'
import { BrowserRouter, Route } from 'react-router-dom'

// Material UI
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'

// Icons
import CloseIcon from '@material-ui/icons/CloseTwoTone'

// MUI Style
import lightBlue from '@material-ui/core/colors/lightBlue'
import blueGrey from '@material-ui/core/colors/blueGrey'
import { createMuiTheme, ThemeProvider, makeStyles } from '@material-ui/core/styles'

// Our components
import AppHeader from './AppHeader'
import Mobiles from './Mobiles'
import MobileMap from './MobileMap'
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

const theme = createMuiTheme({
  palette: {
    primary: lightBlue,
    secondary: blueGrey
  },
  overrides: {
    MuiButton: {
      text: {
        textTransform: 'none'
      }
    },
    MuiTab: {
      root: {
        textTransform: 'none'
      }
    },
    MuiTableCell: {
      root: {
        borderBottom: 'none'
      }
    }
  }
})

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(2)
  },
  root: {
    flexGrow: 1
  }
}))

function App () {
  const [stopDialogOpen, setStopDialogOpen] = useState(false)
  const [currentStop, setCurrentStop] = useState({})

  const [tripDialogOpen, setTripDialogOpen] = useState(false)
  const [currentTrip, setCurrentTrip] = useState({})

  const [organisations, setOrganisations] = useState([])
  const [organisationLookup, setOrganisationLookup] = useState({})
  const [organisationFilter, setOrganisationFilter] = useState([])

  const [mobiles, setMobiles] = useState([])
  const [mobileLookup, setMobileLookup] = useState({})
  const [mobileFilter, setMobileFilter] = useState([])
  const [mobileLocations, setMobileLocations] = useState([])
  const [mobileLocationLookup, setMobileLocationLookup] = useState({})
  const [mobilesNearest, setMobilesNearest] = useState([])
  const [mobilesNearestLookup, setMobilesNearestLookup] = useState({})
  const [mobileLocationTimer, setMobileLocationTimer] = useState(null)

  const [routes, setRoutes] = useState([])
  const [routeLookup, setRouteLookup] = useState({})
  const [routeFilter, setRouteFilter] = useState([])

  const [fitBounds, setFitBounds] = useState(null)
  const [position, setPosition] = useState([-2.1000, 53.6138])
  const [zoom, setZoom] = useState([7])
  const [pitch, setPitch] = useState([0])
  const [bearing, setBearing] = useState([0])
  const [searchType, setSearchType] = useState('')
  const [distance, setDistance] = useState(1609)
  const [postcode, setPostcode] = useState('')
  const [currentPosition, setCurrentPosition] = useState([])
  const [positionUpdateInterval, setPositionUpdateInterval] = useState('')
  const [mapSettings, setMapSettings] = useState({ authorityBoundary: false })

  const [loadingGPS, setLoadingGPS] = useState(false)
  const [loadingMobiles, setLoadingMobiles] = useState(false)
  const [loadingOrganisations, setLoadingOrganisations] = useState(false)
  const [loadingPostcode, setLoadingPostcode] = useState(false)
  const [loadingRoutes, setLoadingRoutes] = useState(false)

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState(false)

  const getOrganisations = () => {
    setLoadingOrganisations(true)
    organisationsHelper.getAllOrganisations(organisations => {
      const organisationLookup = {}
      organisations.forEach(organisation => { organisationLookup[organisation.id] = organisation })
      setOrganisations(organisations)
      setOrganisationLookup(organisationLookup)
      setLoadingOrganisations(false)
    })
  }

  const getMobiles = () => {
    setLoadingMobiles(true)
    mobilesHelper.getAllMobiles(mobiles => {
      const mobileLookup = {}
      mobiles.forEach(mobile => { mobileLookup[mobile.id] = mobile })
      this.setState({ mobiles: mobiles, mobileLookup: mobileLookup, loadingMobiles: false })
    })
  }

  const getRoutes = () => {
    this.setState({ loadingRoutes: true })
    routesHelper.getAllRoutes(routes => {
      const routeLookup = {}
      routes.forEach(route => { routeLookup[route.id] = route })
      this.setState({ routes: routes, routeLookup: routeLookup, loadingRoutes: false })
    })
  }

  const getMobileLocations = () => {
    mobilesHelper.getMobileLocations(locations => {
      const mobileLocationLookup = {}
      locations.forEach(location => { mobileLocationLookup[location.mobileId] = location })
      this.setState({ mobileLocations: locations, mobileLocationLookup: mobileLocationLookup })
    })
  }

  const getMobilesNearest = () => {
    mobilesHelper.getMobilesNearest(currentPosition, distance, mobiles => {
      const mobilesNearestLookup = {}
      mobiles.forEach(mobile => { mobilesNearestLookup[mobile.mobileId] = mobile })
      this.setState({ mobilesNearest: mobiles, mobilesNearestLookup: mobilesNearestLookup })
    })
  }

  useEffect(() => {
    getOrganisations()
    getMobiles()
    getRoutes()
    getMobileLocations()

    const mobileLocationTimer = setInterval(() => {
      getMobileLocations()
    }, 15000)

    setMobileLocationTimer(mobileLocationTimer)
  }, [])

  const viewStop = (stop) => {
    // First open the dialog
    this.openStopDialog(stop)
    // We may or may not have a complete stop object.
    // If calling from the stop table we do - if not we don't, all we have is ID
    if (!stop.name) {
      stopsHelper.getStopById(stop.id, stop => {
        this.setState({ currentStop: stop })
      })
    }
  }
  const openStopDialog = (stop) => this.setState({ currentStop: stop, stopDialogOpen: true })
  const closeStopDialog = () => this.setState({ stopDialogOpen: false })

  const viewTrip = (trip) => {
    // First open the dialog
    this.openTripDialog(trip)
    tripsHelper.getTripById(trip.id, trip => {
      this.setState({ currentTrip: trip })
    })
  }
  const openTripDialog = (trip) => this.setState({ currentTrip: trip, tripDialogOpen: true })
  const closeTripDialog = () => this.setState({ tripDialogOpen: false })

  const viewStopsByOrganisation = (organisationId) => this.setState({ page: 'stops', organisationFilter: [organisationId], mobileFilter: [], routeFilter: [] })
  const viewStopsByMobile = (organisationId, mobileId) => this.setState({ page: 'stops', organisationFilter: [organisationId], mobileFilter: [mobileId], routeFilter: [] })
  const viewStopsByRoute = (organisationId, mobileId, routeId) => this.setState({ page: 'stops', organisationFilter: [organisationId], mobileFilter: [mobileId], routeFilter: [routeId] })
  const clearMobileFilter = () => this.setState({ mobileFilter: [], routeFilter: [] })
  const clearRouteFilter = () => this.setState({ routeFilter: [] })
  const clearOrganisationFilter = () => this.setState({ organisationFilter: [], mobileFilter: [], routeFilter: [] })

  const viewMapStop = (longitude, latitude) => this.setState({ page: 'map', position: [longitude, latitude], zoom: [15], stopDialogOpen: false })

  const logPosition = (fit = false) => {
    this.setState({ loadingGPS: true })
    geoHelper.getCurrentPosition(position => {
      if (position.length === 2) {
        this.getMobilesNearest()
        this.setState({ currentPosition: position, position: position, zoom: [12], loadingGPS: false })
      } else {
        clearInterval(positionUpdateInterval)
        this.setState({ searchType: '', postcode: '', currentPosition: [], positionUpdateInterval: null, snackbarOpen: true, snackbarMessage: 'Could not fetch current location' })
      }
    })
  }

  const clearSearch = () => {
    this.setState({ postcode: '', currentPosition: [], searchType: '', organisationFilter: [], mobileFilter: [], routeFilter: [] })
  }

  // postcodeSearch
  const postcodeSearch = (postcode) => {
    if (postcode === '') {
      this.setState({ snackbarOpen: true, snackbarMessage: 'You must enter a postcode' })
      return
    }

    const newState = { searchType: 'postcode', loadingPostcode: true, postcode: postcode, organisationFilter: [], mobileFilter: [], routeFilter: [] }

    // If we're already tracking GPS then turn this off
    if (searchType === 'gps') {
      clearInterval(positionUpdateInterval)
      newState.positionUpdateInterval = null
    }

    // Get the postcode
    geoHelper.getPostcode(postcode, postcodeData => {
      if (postcodeData.location && postcodeData.location.length === 2) {
        newState.searchType = 'postcode'
        newState.currentPosition = postcodeData.location
        newState.position = postcodeData.location
        newState.zoom = [11]
        newState.loadingPostcode = false
        this.setState(newState)
        this.getMobilesNearest()
      } else {
        this.setState({ snackbarOpen: true, snackbarMessage: 'Could not find postcode' })
      }
    })
  }

  // toggleGPS
  const toggleGPS = () => {
    // If we're already tracking GPS then turn this off
    if (searchType === 'gps') {
      clearInterval(positionUpdateInterval)
      this.setState({ searchType: '', postcode: '', currentPosition: [], positionUpdateInterval: null })
    } else {
      const positionUpdateInterval = setInterval(this.logPosition, 10000)
      this.setState({ positionUpdateInterval: positionUpdateInterval, searchType: 'gps', postcode: '', organisationFilter: [], mobileFilter: [], routeFilter: [] })
      this.logPosition(true)
    }
  }

  const toggleMapSetting = (setting) => {
    const mapSettings = mapSettings
    const currentSetting = mapSettings[setting]
    mapSettings[setting] = !currentSetting
    this.setState({ mapSettings: mapSettings })
  }

  const closeSnackbar = (event, reason) => {
    if (reason === 'clickaway') return
    this.setState({ snackbarOpen: false })
  }

  const classes = useStyles()

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <div className={classes.root}>
          <CssBaseline />
          <AppHeader
            loading={loadingMobiles || loadingOrganisations || loadingRoutes}
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
                      mobiles={mobiles}
                      mobileLookup={mobileLookup}
                      mobileLocationLookup={mobileLocationLookup}
                      mobilesNearestLookup={mobilesNearestLookup}
                      organisationLookup={organisationLookup}
                      viewStop={viewStop}
                      viewStopsByMobile={viewStopsByMobile}
                      viewStopsByOrganisation={viewStopsByOrganisation}
                      organisations={organisations}
                      organisationFilter={organisationFilter}
                      setOrganisationFilter={(organisationId) => { this.setState({ organisationFilter: [organisationId] }) }}
                      clearOrganisationFilter={clearOrganisationFilter}
                      mobileFilter={mobileFilter}
                      setMobileFilter={(mobileId) => { this.setState({ mobileFilter: [mobileId] }) }}
                      clearMobileFilter={clearMobileFilter}
                      routes={routes}
                      routeLookup={routeLookup}
                      routeFilter={routeFilter}
                      setRouteFilter={(routeId) => { this.setState({ routeFilter: [routeId] }) }}
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
                      organisations={organisations}
                      organisationLookup={organisationLookup}
                      organisationFilter={organisationFilter}
                      setOrganisationFilter={(organisationId) => { this.setState({ organisationFilter: [organisationId] }) }}
                      clearOrganisationFilter={clearOrganisationFilter}
                      mobiles={mobiles}
                      mobileLookup={mobileLookup}
                      mobileFilter={mobileFilter}
                      setMobileFilter={(mobileId) => { this.setState({ mobileFilter: [mobileId] }) }}
                      clearMobileFilter={clearMobileFilter}
                      routes={routes}
                      routeLookup={routeLookup}
                      routeFilter={routeFilter}
                      setRouteFilter={(routeId) => { this.setState({ routeFilter: [routeId] }) }}
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
                      bearing={bearing}
                      fitBounds={fitBounds}
                      pitch={pitch}
                      position={position}
                      currentPosition={currentPosition}
                      zoom={zoom}
                      searchType={searchType}
                      mobileLookup={mobileLookup}
                      mobileLocations={mobileLocations.filter(l => l.geox !== null)}
                      organisations={organisations}
                      organisationLookup={organisationLookup}
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
            close={() => closeStopDialog()}
            viewMapStop={viewMapStop}
          />
          <TripDetails
            trip={currentTrip}
            open={tripDialogOpen}
            close={() => closeTripDialog()}
          />
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
            }}
            open={snackbarOpen}
            autoHideDuration={4000}
            onClose={closeSnackbar}
            ContentProps={{
              'aria-describedby': 'message-id'
            }}
            message={<span id='message-id'>{snackbarMessage}</span>}
            action={[
              <IconButton
                key='close'
                aria-label='close'
                color='inherit'
                className={classes.close}
                onClick={closeSnackbar}
              >
                <CloseIcon />
              </IconButton>
            ]}
          />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}

App.propTypes = {
  classes: PropTypes.object.isRequired
}

export default App
