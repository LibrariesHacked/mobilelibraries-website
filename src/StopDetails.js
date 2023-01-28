import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import CircularProgress from '@mui/material/CircularProgress'
import ListSubheader from '@mui/material/ListSubheader'

import { useTheme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'
import useMediaQuery from '@mui/material/useMediaQuery'

import CancelIcon from '@mui/icons-material/CancelTwoTone'
import EventIcon from '@mui/icons-material/EventTwoTone'
import LocationOnIcon from '@mui/icons-material/LocationOnTwoTone'
import PrintIcon from '@mui/icons-material/PrintTwoTone'
import WebIcon from '@mui/icons-material/WebTwoTone'

import { useSearchStateValue } from './context/searchState'
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
  dialogContentActions: {
    backgroundColor: '#e8f5e9',
    border: '1px solid #c8e6c9',
    borderRadius: 3,
    padding: 4
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
  const [{ currentStopId }, dispatchSearch] = useSearchStateValue() //eslint-disable-line
  const [{ stopDialogOpen }, dispatchView] = useViewStateValue() //eslint-disable-line

  const [stop, setStop] = useState({})

  useEffect(() => {
    async function getStop (stopId) {
      const stopData = await stopsModel.getStopById(stopId)
      setStop(stopData)
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
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Dialog
      fullScreen={fullScreen}
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
              <p>{(stop.routeSchedule && stop.routeSchedule.length > 0 ? stop.routeSchedule[0].format('dddd Do MMMM h:mma') : '')}</p>
              <ListSubheader disableSticky>Actions</ListSubheader>
              <div className={classes.dialogContentActions}>
                <Button onClick={getStopCalendar} className={classes.button} color='primary' startIcon={<EventIcon />}>Calendar</Button>
                <Button onClick={getStopPdf} className={classes.button} color='primary' startIcon={<PrintIcon />}>Timetable</Button>
                <Button onClick={() => goToWebsite()} color='primary' startIcon={<WebIcon />}>Website</Button>
                <Button onClick={viewMapStop} className={classes.button} color='primary' startIcon={<LocationOnIcon />} component={Link} to='/map'>Map</Button>
              </div>
            </DialogContent>
          </>
          )
        : <CircularProgress className={classes.progress} color='primary' size={30} />}
      <DialogActions>
        <Button onClick={() => close()} color='secondary' endIcon={<CancelIcon />}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default StopDetails
