import React, { createContext, useContext, useReducer } from 'react'

export const SearchStateContext = createContext()

export const SearchStateProvider = ({ reducer, initialState, children }) => (
  <SearchStateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </SearchStateContext.Provider>
)

export const useSearchStateValue = () => useContext(SearchStateContext)
