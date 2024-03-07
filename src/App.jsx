import React from 'react'

import CssBaseline from '@mui/material/CssBaseline'

import { ThemeProvider } from '@mui/material/styles'

import { ApplicationStateProvider } from './context/applicationState'
import { SearchStateProvider } from './context/searchState'
import { ViewStateProvider } from './context/viewState'

import MobilesApplication from './MobilesApplication'

import theme from './theme'

function App () {
  return (
    <ApplicationStateProvider>
      <SearchStateProvider>
        <ViewStateProvider>
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
