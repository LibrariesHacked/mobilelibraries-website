import React, { useEffect, useState } from 'react'

// Material UI
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import ListSubheader from '@material-ui/core/ListSubheader'
import Typography from '@material-ui/core/Typography'

// Material UI Styles
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import { useApplicationStateValue } from './context/applicationState'
import { useViewStateValue } from './context/viewState'

import * as tripsModel from './models/trips'

const useStyles = makeStyles((theme) => ({
  dialog: {
    border: '1px solid #E0E0E0'
  }
}))

function TripDetails () {
  const [{ currentTripId }, dispatchApplication] = useApplicationStateValue() //eslint-disable-line
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

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const estimatedDuration = Math.round(trip.duration / 60) + ' mins journey time.'
  const distance = Math.round(trip.distance / 1609, 1) + ' mile(s)'

  return (
    <Dialog
      fullScreen={fullScreen}
      disableBackdropClick
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
        <Button onClick={close} color='secondary'>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default TripDetails
