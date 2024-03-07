import React, { createContext, useContext, useReducer } from 'react'

export const SearchStateContext = createContext()

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
  currentMobileLibraryId: null,
  currentTripId: null
}

const searchReducer = (state, action) => {
  switch (action.type) {
    case 'SetCurrentStop':
      return {
        ...state,
        currentStopId: action.stopId
      }
    case 'SetCurrentMobileLibrary':
      return {
        ...state,
        currentMobileLibraryId: action.mobileLibraryId
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

export const SearchStateProvider = ({ children }) => (
  <SearchStateContext.Provider
    value={useReducer(searchReducer, initialSearchState)}
  >
    {children}
  </SearchStateContext.Provider>
)

export const useSearchStateValue = () => useContext(SearchStateContext)
