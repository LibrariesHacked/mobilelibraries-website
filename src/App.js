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
  trips: [],
  currentStopId: null,
  currentTripId: null
}

const initialSearchState = {
  postcode: '',
  searchType: '',
  searchDistance: 1609,
  searchPosition: [],
  searchPositionUpdateInterval: null,
  organisationFilter: [],
  mobileFilter: [],
  routeFilter: []
}

const initialViewState = {
  stopDialogOpen: false,
  tripDialogOpen: false,
  notificationOpen: false,
  notificationMessage: '',
  mapZoom: 12,
  mapPosition: [],
  loadingOrganisations: false,
  loadingMobiles: false,
  loadingRoutes: false,
  loadingMobileLocations: false,
  loadingNearestMobiles: false,
  loadingPostcode: false
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

const searchReducer = (state, action) => {
  switch (action.type) {
    case 'SearchByPostcode':
      return {
        ...state,
        postcode: action.postcode
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
        organisationFilter: [action.mobileId],
        routeFilter: []
      }
    case 'FilterByRoute':
      return {
        ...state,
        routeFilter: [action.routeId]
      }
    default:
      return state
  }
}

const viewReducer = (state, action) => {
  switch (action.type) {
    case 'SetStopDialog':
      return { ...state, stopDialogOpen: action.stopDialogOpen }
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
