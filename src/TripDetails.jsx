import React, { useEffect, useState } from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
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

/**
 * Dialog modal displaying origin, destination, distance, and duration for a selected route trip segment.
 * @returns {JSX.Element} TripDetails dialog component.
 */
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

  return (
    <Dialog
      fullScreen={fullScreen}
      open={tripDialogOpen}
      onClose={close}
      aria-labelledby='trip-dlg-title'
    >
      <DialogTitle id='trip-dlg-title'>
        {trip.title || 'Mobile trip details'}
      </DialogTitle>
      <DialogContent>
        <TableContainer sx={{ mb: 0 }}>
          <Table aria-label='Trip details'>
            <TableBody>
              <TableRow>
                <TableCell component='th' scope='row'>Origin</TableCell>
                <TableCell>{trip.originStopName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component='th' scope='row'>Destination</TableCell>
                <TableCell>{trip.destinationStopName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component='th' scope='row'>Trip length</TableCell>
                <TableCell>{trip.distanceInMiles}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component='th' scope='row'>Trip duration</TableCell>
                <TableCell>{trip.estimatedDuration}</TableCell>
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
