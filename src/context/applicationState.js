import React, { createContext, useContext, useReducer } from 'react'

export const ApplicationStateContext = createContext()

export const ApplicationStateProvider = ({ reducer, initialState, children }) => (
  <ApplicationStateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </ApplicationStateContext.Provider>
)

export const useApplicationStateValue = () => useContext(ApplicationStateContext)
