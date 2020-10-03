import React from 'react'

import CssBaseline from '@material-ui/core/CssBaseline'

import blueGrey from '@material-ui/core/colors/blueGrey'
import red from '@material-ui/core/colors/red'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

import { ApplicationStateProvider } from './context/applicationState'
import { SearchStateProvider } from './context/searchState'
import { ViewStateProvider } from './context/viewState'

import MobilesApplication from './MobilesApplication'

const initialApplicationState = {
  organisations: [],
  organisationLookup: {},
  mobiles: [],
  mobileLookup: {},
  mobileLocations: [],
  mobileLocationLookup: {},
  mobilesNearest: [],
  mobilesNearestLookup: {},
  routes: [],
  routeLookup: {},
  stops: [],
  trips: []
}

const applicationReducer = (state, action) => {
  switch (action.type) {
    case 'AddOrganisations':
      return {
        ...state,
        organisations: action.organisations,
        organisationLookup: action.organisationLookup
      }
    case 'AddMobileLocations':
      return {
        ...state,
        mobileLocations: action.mobileLocations,
        mobileLocationLookup: action.mobileLocationLookup
      }
    case 'AddRoutes':
      return {
        ...state,
        routes: action.routes,
        routeLookup: action.routeLookup
      }
    case 'AddMobiles':
      return {
        ...state,
        mobiles: action.mobiles,
        mobileLookup: action.mobileLookup
      }
    case 'UpdateMobilesNearest':
      return {
        ...state,
        mobilesNearest: action.mobilesNearest,
        mobilesNearestLookup: action.mobilesNearestLookup
      }
    default:
      return state
  }
}

const initialSearchState = {
  searchPostcode: '',
  searchType: '',
  searchDistance: 1609,
  searchPosition: [],
  searchPositionUpdateInterval: null,
  organisationFilter: [],
  mobileFilter: [],
  routeFilter: [],
  currentStopId: null,
  currentTripId: null
}

const searchReducer = (state, action) => {
  switch (action.type) {
    case 'SetCurrentStop':
      return {
        ...state,
        currentStopId: action.stopId
      }
    case 'SetCurrentTrip':
      return {
        ...state,
        currentTripId: action.tripId
      }
    case 'SetSearchDistance':
      return {
        ...state,
        searchDistance: action.searchDistance
      }
    case 'SetPostcodeSearch':
      return {
        ...state,
        searchPostcode: action.searchPostcode,
        searchPosition: action.searchPosition,
        searchType: 'postcode',
        organisationFilter: [],
        mobileFilter: [],
        routeFilter: []
      }
    case 'FilterByOrganisation':
      return {
        ...state,
        organisationFilter: [action.organisationId],
        mobileFilter: [],
        routeFilter: [],
        searchPostcode: '',
        searchPosition: [],
        searchType: ''
      }
    case 'FilterByMobile':
      return {
        ...state,
        organisationFilter: [action.organisationId],
        mobileFilter: [action.mobileId],
        routeFilter: [],
        searchPostcode: '',
        searchPosition: [],
        searchType: ''
      }
    case 'FilterByRoute':
      return {
        ...state,
        routeFilter: [action.routeId],
        searchPostcode: '',
        searchPosition: [],
        searchType: ''
      }
    case 'ClearAll':
      return {
        ...state,
        organisationFilter: [],
        mobileFilter: [],
        routeFilter: [],
        searchPostcode: '',
        searchPosition: [],
        searchType: ''
      }
    case 'ClearMobileFilter':
      return {
        ...state,
        mobileFilter: [],
        routeFilter: [],
        searchPostcode: '',
        searchPosition: [],
        searchType: ''
      }
    case 'ClearRouteFilter':
      return {
        ...state,
        routeFilter: [],
        searchPostcode: '',
        searchPosition: [],
        searchType: ''
      }
    default:
      return state
  }
}

const initialViewState = {
  stopDialogOpen: false,
  tripDialogOpen: false,
  notificationOpen: false,
  notificationMessage: '',
  mapZoom: [7],
  mapPosition: [-1.155414, 52.691432],
  mapSettings: {
    authorityBoundary: false
  },
  mapSettingsDialogOpen: false,
  loadingOrganisations: false,
  loadingMobiles: false,
  loadingRoutes: false,
  loadingMobileLocations: false,
  loadingNearestMobiles: false,
  loadingPostcode: false
}

const viewReducer = (state, action) => {
  switch (action.type) {
    case 'SetNotificationMessage':
      return { ...state, notificationMessage: action.notificationMessage }
    case 'SetNotification':
      return { ...state, notificationOpen: action.notificationOpen }
    case 'ShowNotification':
      return { ...state, notificationOpen: true, notificationMessage: action.notificationMessage }
    case 'SetStopDialog':
      return { ...state, stopDialogOpen: action.stopDialogOpen }
    case 'SetTripDialog':
      return { ...state, tripDialogOpen: action.tripDialogOpen }
    case 'SetMapSettingsDialog':
      return { ...state, mapSettingsDialogOpen: action.mapSettingsDialogOpen }
    case 'ToggleMapSetting': {
      const settings = state.mapSettings
      settings[action.mapSetting] = !settings[action.mapSetting]
      return { ...state, mapSettings: settings }
    }
    case 'LoadingPostcode':
      return { ...state, loadingPostcode: true }
    case 'SetPostcodeSearch':
      return { ...state, loadingPostcode: false, mapPosition: action.mapPosition, mapZoom: [13] }
    case 'ToggleLoadingPostcode':
      return { ...state, loadingPostcode: !state.loadingPostcode }
    case 'SetMapPosition':
      return { ...state, mapPosition: action.mapPosition, mapZoom: [action.mapZoom] }
    default:
      return state
  }
}

const theme = createMuiTheme({
  palette: {
    primary: {
      main: red[900]
    },
    secondary: {
      main: blueGrey[700]
    }
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
    MuiTypography: {
      button: {
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

function App () {
  return (
    <ApplicationStateProvider initialState={initialApplicationState} reducer={applicationReducer}>
      <SearchStateProvider initialState={initialSearchState} reducer={searchReducer}>
        <ViewStateProvider initialState={initialViewState} reducer={viewReducer}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <MobilesApplication />
          </ThemeProvider>
        </ViewStateProvider>
      </SearchStateProvider>
    </ApplicationStateProvider>
  )
}

export default App
