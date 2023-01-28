import React, { useEffect, useState } from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import ListSubheader from '@mui/material/ListSubheader'
import Typography from '@mui/material/Typography'

import { useTheme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'
import useMediaQuery from '@mui/material/useMediaQuery'

import CancelIcon from '@mui/icons-material/CancelTwoTone'

import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

import * as tripsModel from './models/trips'

const useStyles = makeStyles((theme) => ({
  dialog: {
    border: '1px solid #E0E0E0'
  }
}))

function TripDetails () {
  const [{ currentTripId }, dispatchSearch] = useSearchStateValue() //eslint-disable-line
  const [{ tripDialogOpen }, dispatchView] = useViewStateValue() //eslint-disable-line

  const [trip, setTrip] = useState({})

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

  const classes = useStyles()
  const theme = useTheme()

  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const estimatedDuration = Math.round(trip.duration / 60) + ' mins journey time.'
  const distance = Math.round(trip.distance / 1609, 1) + ' mile(s)'

  return (
    <Dialog
      fullScreen={fullScreen}
      open={tripDialogOpen}
      onClose={close}
      BackdropProps={{ invisible: true }}
      PaperProps={{ elevation: 0, className: classes.dialog }}
    >
      <DialogTitle>Trip details</DialogTitle>
      <DialogContent>
        <ListSubheader disableSticky>{'From ' + trip.originStopName + ' to ' + trip.destinationStopName}</ListSubheader>
        <Typography variant='body2' component='p'>{estimatedDuration + ' ' + distance}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={close} color='secondary' endIcon={<CancelIcon />}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default TripDetails
