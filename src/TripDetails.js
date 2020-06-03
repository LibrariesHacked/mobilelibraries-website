import React from 'react'

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

const useStyles = makeStyles((theme) => ({
  dialog: {
    border: '1px solid #E0E0E0'
  }
}))

function TripDetails (props) {
  const { trip, open, close } = props

  const classes = useStyles()
  const theme = useTheme()

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const estimatedDuration = Math.round(trip.duration / 60) + ' mins journey time.'
  const distance = Math.round(trip.distance / 1609, 1) + ' mile(s)'

  return (
    <Dialog
      fullScreen={fullScreen}
      disableBackdropClick
      open={open}
      onClose={close}
      BackdropProps={{ invisible: true }}
      PaperProps={{ elevation: 0, className: classes.dialog }}
    >
      <DialogTitle>Trip details</DialogTitle>
      <DialogContent>
        <ListSubheader disableSticky>{'From ' + trip.origin_stop_name + ' to ' + trip.destination_stop_name}</ListSubheader>
        <Typography variant='body2' component='p'>{estimatedDuration + ' ' + distance}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={close} color='secondary'>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default TripDetails
