import React, { createContext, useContext, useReducer } from 'react'

export const ViewStateContext = createContext()

const initialViewState = {
  stopDialogOpen: false,
  mobileLibraryDialogOpen: false,
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
  loadingPostcode: false,
  loadingLocation: false,
  locationLoaded: false
}

const viewReducer = (state, action) => {
  switch (action.type) {
    case 'SetNotificationMessage':
      return { ...state, notificationMessage: action.notificationMessage }
    case 'SetNotification':
      return { ...state, notificationOpen: action.notificationOpen }
    case 'ShowNotification':
      return {
        ...state,
        notificationOpen: true,
        notificationMessage: action.notificationMessage
      }
    case 'SetStopDialog':
      return { ...state, stopDialogOpen: action.stopDialogOpen }
    case 'SetMobileLibraryDialog':
      return {
        ...state,
        mobileLibraryDialogOpen: action.mobileLibraryDialogOpen
      }
    case 'SetTripDialog':
      return { ...state, tripDialogOpen: action.tripDialogOpen }
    case 'SetMapSettingsDialog':
      return { ...state, mapSettingsDialogOpen: action.mapSettingsDialogOpen }
    case 'ToggleMapSetting': {
      const settings = state.mapSettings
      settings[action.mapSetting] = !settings[action.mapSetting]
      return { ...state, mapSettings: settings }
    }
    case 'SetPostcodeSearch':
      return { ...state, mapPosition: action.mapPosition, mapZoom: [13] }
    case 'ToggleLoadingPostcode':
      return { ...state, loadingPostcode: !state.loadingPostcode }
    case 'ToggleLoadingLocation':
      return {
        ...state,
        loadingLocation: !state.loadingLocation,
        locationLoaded: true
      }
    case 'SetMapPosition':
      return {
        ...state,
        mapPosition: action.mapPosition,
        mapZoom: [action.mapZoom]
      }
    default:
      return state
  }
}

export const ViewStateProvider = ({ children }) => (
  <ViewStateContext.Provider value={useReducer(viewReducer, initialViewState)}>
    {children}
  </ViewStateContext.Provider>
)

export const useViewStateValue = () => useContext(ViewStateContext)
