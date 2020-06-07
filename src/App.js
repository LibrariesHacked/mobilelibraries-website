// React
import React from 'react'

// Material UI
import CssBaseline from '@material-ui/core/CssBaseline'

// Styling
import blueGrey from '@material-ui/core/colors/blueGrey'
import lightBlue from '@material-ui/core/colors/lightBlue'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

import { ApplicationStateProvider } from './context/applicationState'
import { SearchStateProvider } from './context/searchState'
import { ViewStateProvider } from './context/viewState'

import MobilesApplication from './MobilesApplication'

const initialApplicationState = {
  organisations: [],
  organisationLookup: {},
  organisationFilter: [],
  mobiles: [],
  mobilesLookup: {},
  mobileFilter: [],
  mobileLocations: [],
  mobileLocationLookup: {},
  mobilesNearest: [],
  mobilesNearestLookup: {},
  routes: [],
  routeLookup: {},
  routeFilter: [],
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
  postcode: '',
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
    case 'SearchByPostcode':
      return {
        ...state,
        postcode: action.postcode
      }
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
        organisationFilter: [],
        mobileFilter: [],
        routeFilter: []
      }
    case 'FilterByOrganisation':
      return {
        ...state,
        organisationFilter: [action.organisationId],
        mobileFilter: [],
        routeFilter: []
      }
    case 'FilterByMobile':
      return {
        ...state,
        organisationFilter: [action.organisationId],
        mobileFilter: [action.mobileId],
        routeFilter: []
      }
    case 'FilterByRoute':
      return {
        ...state,
        organisationFilter: [action.organisationId],
        mobileFilter: [action.mobileId],
        routeFilter: [action.routeId]
      }
    case 'ClearFilters':
      return {
        ...state,
        organisationFilter: [],
        mobileFilter: [],
        routeFilter: []
      }
    case 'ClearMobileFilter':
      return {
        ...state,
        mobileFilter: [],
        routeFilter: []
      }
    case 'ClearRouteFilter':
      return {
        ...state,
        routeFilter: []
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
  mapZoom: 12,
  mapPosition: [],
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
      return { ...state, loadingPostcode: false, mapZoom: 11 }
    case 'SetMapPosition':
      return { ...state, mapPosition: action.mapPosition, mapZoom: action.mapZoom }
    default:
      return state
  }
}

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
