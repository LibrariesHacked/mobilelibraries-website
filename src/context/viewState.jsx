import React, { createContext, useContext, useReducer } from 'react'

export const ViewStateContext = createContext()

const initialViewState = {
  stopDetailsExpanded: false,
  mobileLibraryDialogOpen: false,
  tripDialogOpen: false,
  notificationOpen: false,
  notificationMessage: '',
  mapZoom: [6],
  mapPosition: [-1.8, 53.2],
  mapFlyToPosition: null,
  mapSettings: {
    authorityBoundary: false
  },
  mapSettingsDialogOpen: false,
  loadingPostcode: false,
  loadingLocation: false,
  locationLoaded: false
}

/**
 * Reducer for managing UI view state (popups, notifications, map camera target, loading flags).
 *
 * @param {Object} state - Current view state.
 * @param {Object} action - Dispatched reducer action.
 * @returns {Object} Updated view state.
 */
const viewReducer = (state, action) => {
  switch (action.type) {
    case 'SetNotification':
      return { ...state, notificationOpen: action.notificationOpen }
    case 'ShowNotification':
      return {
        ...state,
        notificationOpen: true,
        notificationMessage: action.notificationMessage
      }
    case 'SetStopExpanded':
      return { ...state, stopDetailsExpanded: action.stopDetailsExpanded }
    case 'SetMobileLibraryDialog':
      return {
        ...state,
        mobileLibraryDialogOpen: action.mobileLibraryDialogOpen
      }
    case 'SetTripDialog':
      return { ...state, tripDialogOpen: action.tripDialogOpen }
    case 'SetMapSettingsDialog':
      return { ...state, mapSettingsDialogOpen: action.mapSettingsDialogOpen }
    case 'ToggleMapSetting':
      return {
        ...state,
        mapSettings: {
          ...state.mapSettings,
          [action.mapSetting]: !state.mapSettings[action.mapSetting]
        }
      }
    case 'FlyTo':
      return {
        ...state,
        mapFlyToPosition: action.mapFlyToPosition,
        mapZoom: [action.mapZoom]
      }
    case 'ToggleLoadingPostcode':
      return { ...state, loadingPostcode: !state.loadingPostcode }
    case 'ToggleLoadingLocation':
      return { ...state, loadingLocation: !state.loadingLocation }
    case 'SetLocationLoaded':
      return { ...state, locationLoaded: true }
    default:
      return state
  }
}

/**
 * Context provider for UI view state.
 *
 * @param {{ children: React.ReactNode }} props - Component props.
 * @returns {JSX.Element} Provider element.
 */
export const ViewStateProvider = ({ children }) => (
  <ViewStateContext.Provider value={useReducer(viewReducer, initialViewState)}>
    {children}
  </ViewStateContext.Provider>
)

/**
 * Hook to access the UI view state and dispatch function.
 *
 * @returns {[Object, Function]} Tuple of `[viewState, dispatchView]`.
 */
export const useViewStateValue = () => useContext(ViewStateContext)
