import React, { createContext, useContext, useReducer } from 'react'

export const ApplicationStateContext = createContext()

const initialApplicationState = {
  localAuthorities: [],
  localAuthorityLookup: {},
  mobiles: [],
  mobileLookup: {},
  mobileLocations: [],
  mobileLocationLookup: {},
  mobilesNearest: [],
  mobilesNearestLookup: {},
  routes: [],
  routeLookup: {}
}

/**
 * Reducer for managing global application domain data (local authorities, mobiles, routes, locations).
 *
 * @param {Object} state - Current application state.
 * @param {Object} action - Dispatched reducer action.
 * @returns {Object} Updated application state.
 */
const applicationReducer = (state, action) => {
  switch (action.type) {
    case 'InitializeApplicationData':
      return {
        ...state,
        localAuthorities: action.localAuthorities,
        localAuthorityLookup: action.localAuthorityLookup,
        mobiles: action.mobiles,
        mobileLookup: action.mobileLookup,
        routes: action.routes,
        routeLookup: action.routeLookup,
        mobileLocations: action.mobileLocations,
        mobileLocationLookup: action.mobileLocationLookup
      }
    case 'AddMobileLocations':
      return {
        ...state,
        mobileLocations: action.mobileLocations,
        mobileLocationLookup: action.mobileLocationLookup
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

/**
 * Context provider for global application domain data.
 *
 * @param {{ children: React.ReactNode }} props - Component props.
 * @returns {JSX.Element} Provider element.
 */
export const ApplicationStateProvider = ({ children }) => (
  <ApplicationStateContext.Provider
    value={useReducer(applicationReducer, initialApplicationState)}
  >
    {children}
  </ApplicationStateContext.Provider>
)

/**
 * Hook to access the global application state and dispatch function.
 *
 * @returns {[Object, Function]} Tuple of `[applicationState, dispatchApplication]`.
 */
export const useApplicationStateValue = () =>
  useContext(ApplicationStateContext)
