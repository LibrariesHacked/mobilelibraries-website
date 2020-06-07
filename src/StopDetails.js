import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import CircularProgress from '@material-ui/core/CircularProgress'
import Divider from '@material-ui/core/Divider'
import ListSubheader from '@material-ui/core/ListSubheader'

import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

// MUI Icons
import EventIcon from '@material-ui/icons/EventTwoTone'
import PrintIcon from '@material-ui/icons/PrintTwoTone'
import LocationOnIcon from '@material-ui/icons/LocationOnTwoTone'

import { useApplicationStateValue } from './context/applicationState'
import { useViewStateValue } from './context/viewState'

import * as stopsModel from './models/stops'

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

function StopDetails () {
  const [{ currentStopId }, dispatchApplication] = useApplicationStateValue() //eslint-disable-line
  const [{ stopDialogOpen }, dispatchView] = useViewStateValue() //eslint-disable-line

  const [stop, setStop] = useState({})

  useEffect(() => {
    async function getStop (stopId) {
      const stop = await stopsModel.getStopById(stopId)
      setStop(stop)
    }
    if (currentStopId != null) getStop(currentStopId)
  }, [currentStopId])

  const getStopCalendar = () => window.open(config.api + '/stops/' + stop.id + '/ics')

  const getStopPdf = () => window.open(config.api + '/stops/' + stop.id + '/pdf', '_blank')

  const goToWebsite = () => window.open(stop.timetable, '_blank')

  const viewMapStop = () => {
    dispatchView({ type: 'SetMapPosition', mapPosition: [stop.longitude, stop.latitude], mapZoom: 14 })
  }

  const close = () => {
    dispatchView({ type: 'SetStopDialog', stopDialogOpen: false })
  }

  const theme = useTheme()
  const classes = useStyles()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Dialog
      fullScreen={fullScreen}
      disableBackdropClick
      open={stopDialogOpen}
      onClose={close}
      aria-labelledby='dlg-title'
      BackdropProps={{ invisible: true }}
      PaperProps={{ elevation: 0, className: classes.dialog }}
    >
      {stop && stop.routeDays
        ? (
          <>
            <DialogTitle id='dlg-title'>{stop.name + '. ' + stop.community}</DialogTitle>
            <DialogContent>
              <ListSubheader>{(stop.routeSchedule && stop.routeSchedule.length > 0 ? stop.routeSchedule[0].format('dddd Do MMMM h:mma') : '')}</ListSubheader>
              <br />
              <Divider />
              <br />
              <Button onClick={getStopCalendar} className={classes.button} color='primary' startIcon={<EventIcon />}>Calendar</Button>
              <Button onClick={getStopPdf} className={classes.button} color='primary' startIcon={<PrintIcon />}>Timetable</Button>
              <Button onClick={viewMapStop} className={classes.button} color='primary' startIcon={<LocationOnIcon />} component={Link} to='/map'>Map</Button>
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
