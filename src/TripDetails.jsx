import React, { useEffect, useState } from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'

import { useTheme } from '@mui/material/styles'

import useMediaQuery from '@mui/material/useMediaQuery'

import CancelIcon from '@mui/icons-material/CancelRounded'

import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import * as tripsModel from './models/trips'

const TripDetails = () => {
  const [{ currentTripId }] = useSearchStateValue()
  const [{ tripDialogOpen }, dispatchView] = useViewStateValue() //eslint-disable-line

  const [trip, setTrip] = useState({})

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    async function getTrip (tripId) {
      const trip = await tripsModel.getTripById(tripId)
      setTrip(trip)
    }
    if (currentTripId != null) getTrip(currentTripId)
  }, [currentTripId])

  const close = () => {
    dispatchView({ type: 'SetTripDialog', tripDialogOpen: false })
  }

  const estimatedDuration = Math.round(trip.duration / 60) + ' minutes'
  const distance = Math.round(trip.distance / 1609, 1) + ' mile(s)'

  return (
    <Dialog fullScreen={fullScreen} open={tripDialogOpen} onClose={close}>
      <DialogTitle>
        {trip.originStopName && trip.destinationStopName
          ? `${trip.originStopName} to ${trip.destinationStopName}`
          : 'Mobile trip details'}
      </DialogTitle>
      <DialogContent dividers>
        <TableContainer component={Paper} variant='outlined'>
          <Table size='small'>
            <TableBody>
              <TableRow>
                <TableCell variant='head'>Origin</TableCell>
                <TableCell>{trip.originStopName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant='head'>Destination</TableCell>
                <TableCell>{trip.destinationStopName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant='head'>Trip length</TableCell>
                <TableCell>{distance}</TableCell>
              </TableRow>
              <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell variant='head'>Trip duration</TableCell>
                <TableCell>{estimatedDuration}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={close} color='secondary' endIcon={<CancelIcon />}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TripDetails
