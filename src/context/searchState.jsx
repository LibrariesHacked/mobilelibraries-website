import React, { createContext, useContext, useReducer } from 'react'
import { METERS_PER_MILE } from '../helpers/utils'

export const SearchStateContext = createContext()

const emptySearchLocation = {
  searchPostcode: '',
  searchPosition: [],
  searchType: ''
}

const emptyFilters = {
  organisationFilter: [],
  mobileFilter: [],
  routeFilter: []
}

const initialSearchState = {
  ...emptySearchLocation,
  ...emptyFilters,
  searchDistance: METERS_PER_MILE,
  searchPositionUpdateInterval: null,
  currentStopId: null,
  currentMobileLibraryId: null,
  currentTripId: null
}

/**
 * Reducer for managing search parameters, active filters, and selected entity IDs.
 * @param {Object} state - Current search state.
 * @param {Object} action - Dispatched reducer action.
 * @returns {Object} Updated search state.
 */
const searchReducer = (state, action) => {
  switch (action.type) {
    case 'SetCurrentStop':
      return {
        ...state,
        currentStopId: action.currentStopId
      }
    case 'SetCurrentMobileLibrary':
      return {
        ...state,
        currentMobileLibraryId: action.mobileLibraryId
      }
    case 'SetCurrentTrip':
      return {
        ...state,
        currentTripId: action.currentTripId
      }
    case 'SetSearchDistance':
      return {
        ...state,
        searchDistance: action.searchDistance
      }
    case 'SetPostcodeSearch':
      return {
        ...state,
        ...emptyFilters,
        searchPostcode: action.searchPostcode,
        searchPosition: action.searchPosition,
        searchType: 'postcode'
      }
    case 'SetLocation':
      return {
        ...state,
        ...emptyFilters,
        searchPosition: action.searchPosition,
        searchType: 'gps'
      }
    case 'FilterByOrganisation':
      return {
        ...state,
        ...emptySearchLocation,
        organisationFilter: [action.organisationId],
        mobileFilter: [],
        routeFilter: []
      }
    case 'FilterByMobile':
      return {
        ...state,
        ...emptySearchLocation,
        organisationFilter: [action.organisationId],
        mobileFilter: [action.mobileId],
        routeFilter: []
      }
    case 'FilterByRoute':
      return {
        ...state,
        ...emptySearchLocation,
        routeFilter: [action.routeId]
      }
    case 'ClearAll':
      return {
        ...state,
        ...emptyFilters,
        ...emptySearchLocation
      }
    case 'ClearMobileFilter':
      return {
        ...state,
        ...emptySearchLocation,
        mobileFilter: [],
        routeFilter: []
      }
    case 'ClearRouteFilter':
      return {
        ...state,
        ...emptySearchLocation,
        routeFilter: []
      }
    default:
      return state
  }
}

/**
 * Context provider for search and filter state.
 * @param {{ children: React.ReactNode }} props - Component props.
 * @returns {JSX.Element} Provider element.
 */
export const SearchStateProvider = ({ children }) => (
  <SearchStateContext.Provider
    value={useReducer(searchReducer, initialSearchState)}
  >
    {children}
  </SearchStateContext.Provider>
)

/**
 * Hook to access the search state and dispatch function.
 * @returns {[Object, Function]} Tuple of `[searchState, dispatchSearch]`.
 */
export const useSearchStateValue = () => useContext(SearchStateContext)
