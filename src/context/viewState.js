import React, { createContext, useContext, useReducer } from 'react'

export const ViewStateContext = createContext()

export const SearchStateProvider = ({ reducer, initialState, children }) => (
  <ViewStateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </ViewStateContext.Provider>
)

export const useSearchStateValue = () => useContext(ViewStateContext)
