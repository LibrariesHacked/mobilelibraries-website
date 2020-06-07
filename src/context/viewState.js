import React, { createContext, useContext, useReducer } from 'react'

export const ViewStateContext = createContext()

export const ViewStateProvider = ({ reducer, initialState, children }) => (
  <ViewStateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </ViewStateContext.Provider>
)

export const useViewStateValue = () => useContext(ViewStateContext)
