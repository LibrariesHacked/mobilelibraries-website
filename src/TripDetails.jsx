import React, { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import ListSubheader from '@mui/material/ListSubheader'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'

import { lighten } from '@mui/material'

import { useTheme } from '@mui/material/styles'

import useMediaQuery from '@mui/material/useMediaQuery'

import CancelIcon from '@mui/icons-material/CancelRounded'

import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import * as tripsModel from './models/trips'

const TripDetails = () => {
  const [{ currentTripId }, dispatchSearch] = useSearchStateValue() //eslint-disable-line
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
    <Dialog
      fullScreen={fullScreen}
      open={tripDialogOpen}
      onClose={close}
      slotProps={{
        backdrop: { sx: { backgroundColor: 'rgba(0, 0, 0, 0.1)' } }
      }}
      PaperProps={{ elevation: 0, sx: { border: 1, borderColor: '#ccc' } }}
    >
      <DialogTitle>Mobile trip details</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            border: 2,
            borderRadius: 2,
            borderColor: theme => lighten(theme.palette.primary.main, 0.5),
            padding: theme => theme.spacing(1)
          }}
        >
          <ListSubheader disableSticky>
            {trip.originStopName + ' to ' + trip.destinationStopName}
          </ListSubheader>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              marginBottom: theme => theme.spacing(1)
            }}
          >
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
                <TableRow>
                  <TableCell variant='head'>Trip duration</TableCell>
                  <TableCell>{estimatedDuration}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
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
