import React from 'react'
import { Link } from 'react-router-dom'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import CircularProgress from '@material-ui/core/CircularProgress'
import Divider from '@material-ui/core/Divider'
import ListSubheader from '@material-ui/core/ListSubheader'

import { makeStyles } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

// MUI Icons
import EventIcon from '@material-ui/icons/EventTwoTone'
import PrintIcon from '@material-ui/icons/PrintTwoTone'
import LocationOnIcon from '@material-ui/icons/LocationOnTwoTone'

// Moment
import moment from 'moment'

const config = require('./helpers/config.json')

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1)
  },
  dialog: {
    border: '1px solid #E0E0E0'
  },
  leftIcon: {
    marginRight: theme.spacing(1)
  },
  list: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  progress: {
    margin: theme.spacing(2)
  }
}))

function StopDetails (stop, open, close) {
  const getStopCalendar = () => window.open(config.api + '/stops/' + this.props.stop.id + '/ics')

  const getStopPdf = () => window.open(config.api + '/stops/' + this.props.stop.id + '/pdf', '_blank')

  const viewMapStop = () => this.props.viewMapStop(this.props.stop.longitude, this.props.stop.latitude)

  const goToWebsite = () => window.open(this.props.stop.timetable, '_blank')

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const classes = useStyles()

  return (
    <Dialog
      fullScreen={fullScreen}
      disableBackdropClick
      open={open}
      onClose={close}
      aria-labelledby='dlg-title'
      BackdropProps={
        {
          invisible: true
        }
      }
      PaperProps={{ elevation: 0, className: classes.dialog }}
    >
      {stop && stop.route_days
        ? (
          <>
            <DialogTitle id='dlg-title'>{stop.name + '. ' + stop.community}</DialogTitle>
            <DialogContent>
              <ListSubheader>{(stop.route_schedule && stop.route_schedule.length > 0 ? moment(stop.route_schedule[0]).format('dddd Do MMMM h:mma') : '')}</ListSubheader>
              <br />
              <Divider />
              <br />
              <Button onClick={() => getStopCalendar()} className={classes.button} color='primary' startIcon={<EventIcon />}>Calendar</Button>
              <Button onClick={() => getStopPdf()} className={classes.button} color='primary' startIcon={<PrintIcon />}>Timetable</Button>
              <Button onClick={() => viewMapStop()} className={classes.button} color='primary' startIcon={<LocationOnIcon />} component={Link} to='/map'>Map</Button>
            </DialogContent>
          </>
        ) : <CircularProgress className={classes.progress} color='secondary' size={30} />}
      <DialogActions>
        <Button onClick={() => goToWebsite()} color='primary'>Website</Button>
        <Button onClick={() => close()} color='secondary'>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default StopDetails
