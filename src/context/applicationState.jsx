import React, { createContext, useContext, useReducer } from 'react'

export const ApplicationStateContext = createContext()

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

/**
 * Reducer for managing global application domain data (organisations, mobiles, routes, locations).
 * @param {Object} state - Current application state.
 * @param {Object} action - Dispatched reducer action.
 * @returns {Object} Updated application state.
 */
const applicationReducer = (state, action) => {
  switch (action.type) {
    case 'InitializeApplicationData':
      return {
        ...state,
        organisations: action.organisations,
        organisationLookup: action.organisationLookup,
        mobiles: action.mobiles,
        mobileLookup: action.mobileLookup,
        routes: action.routes,
        routeLookup: action.routeLookup,
        mobileLocations: action.mobileLocations,
        mobileLocationLookup: action.mobileLocationLookup
      }
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

/**
 * Context provider for global application domain data.
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
 * @returns {[Object, Function]} Tuple of `[applicationState, dispatchApplication]`.
 */
export const useApplicationStateValue = () =>
  useContext(ApplicationStateContext)
