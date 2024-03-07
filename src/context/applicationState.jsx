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

export const ApplicationStateProvider = ({ children }) => (
  <ApplicationStateContext.Provider
    value={useReducer(applicationReducer, initialApplicationState)}
  >
    {children}
  </ApplicationStateContext.Provider>
)

export const useApplicationStateValue = () =>
  useContext(ApplicationStateContext)
