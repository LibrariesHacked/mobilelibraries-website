// React
import React from 'react'

// Material UI
import CssBaseline from '@material-ui/core/CssBaseline'

// Styling
import blueGrey from '@material-ui/core/colors/blueGrey'
import lightBlue from '@material-ui/core/colors/lightBlue'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

import { StateProvider } from './context/state'

import MobilesApplication from './MobilesApplication'

const initialState = {
  organisations: [],
  organisationLookup: {},
  organisationFilter: [],
  mobiles: [],
  mobilesLookup: {},
  mobileFilter: [],
  mobileLocations: [],
  mobileLocationLookup: {},
  routes: [],
  routeLookup: {},
  routeFilter: []
}

const reducer = (state, action) => {
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
    <StateProvider initialState={initialState} reducer={reducer}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MobilesApplication />
      </ThemeProvider>
    </StateProvider>
  )
}

export default App
