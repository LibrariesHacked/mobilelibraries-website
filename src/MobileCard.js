import React from 'react'

import { Link } from 'react-router-dom'

import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CircularProgress from '@material-ui/core/CircularProgress'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'

import LocationOnIcon from '@material-ui/icons/LocationOnTwoTone'
import WebIcon from '@material-ui/icons/WebTwoTone'

import { makeStyles } from '@material-ui/core/styles'

import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

const useStyles = makeStyles((theme) => ({
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(1.2)'
  },
  card: {
    minWidth: 275
  },
  leftIcon: {
    marginRight: theme.spacing(1)
  },
  title: {
    fontSize: 12,
    fontWeight: 500,
    align: 'right'
  },
  verticalDivider: {
    width: 1,
    height: 28,
    margin: 8
  },
  progress: {
    margin: theme.spacing(2)
  }
}))

function MobileCard (props) {
  const { mobile, organisation, location } = props
  const [{ }, dispatchSearch] = useSearchStateValue() // eslint-disable-line
  const [{ }, dispatchView] = useViewStateValue() // eslint-disable-line

  const viewStopsByMobile = (organisationId, mobileId) => {
    dispatchSearch({ type: 'FilterByMobile', organisationId: organisationId, mobileId: mobileId })
  }

  const viewStop = (stopId) => {
    dispatchSearch({ type: 'SetCurrentStop', stopId: stopId })
    dispatchView({ type: 'SetStopDialog', stopDialogOpen: true })
  }

  const stopButton = (stop) => {
    return <Button color='secondary' onClick={() => viewStop(stop.stopId)}>{stop.stopName}</Button>
  }

  const offRoadMessage = (status) => {
    return (
      <Typography>{status.message}</Typography>
    )
  }

  const preRouteMessage = (status) => {
    const button = stopButton(status.args[0])
    return (
      <>
        <Typography>
          {status.message}
          {button}
          {status.args[1]}
        </Typography>
      </>
    )
  }

  const atStopMessage = (status) => {
    const button = stopButton(status.args[0])
    return (
      <>
        <Typography>
          {status.message}
          {button}
          {' for ' + status.args[1]}
        </Typography>
      </>
    )
  }

  const betweenStopsMessage = (status) => {
    const button = stopButton(status.args[0])
    return (
      <>
        <Typography>
          {status.message}
          {button}
          {status.args[1]}
        </Typography>
      </>
    )
  }

  const postRouteMessage = (status) => <Typography>{status.message}</Typography>

  const classes = useStyles()

  let statusMessage = null
  if (location) {
    const status = location.getStatus()
    if (status && status.type === 'offRoad') statusMessage = offRoadMessage(status)
    if (status && status.type === 'preRoute') statusMessage = preRouteMessage(status)
    if (status && status.type === 'atStop') statusMessage = atStopMessage(status)
    if (status && status.type === 'betweenStops') statusMessage = betweenStopsMessage(status)
    if (status && status.type === 'postRoute') statusMessage = postRouteMessage(status)
  }

  if (!statusMessage) statusMessage = <CircularProgress className={classes.progress} color='primary' size={30} />
  const bull = <span className={classes.bullet}>•</span>

  return (
    <Card className={classes.card} elevation={0}>
      <CardContent>
        <Typography className={classes.title} gutterBottom>
          {mobile.numberRoutes + ' route' + (mobile.numberRoutes > 1 ? 's' : '')}
          {bull}
          {mobile.numberStops + ' stop' + (mobile.numberStops > 1 ? 's' : '')}
        </Typography>
        <Typography variant='h6' component='h2'>{(organisation ? organisation.name + ' ' : '') + mobile.name}</Typography>
        {statusMessage}
      </CardContent>
      <CardActions>
        <Tooltip title='Mobile library stops'>
          <Button component={Link} to='/stops' size='small' color='primary' className={classes.button} onClick={() => viewStopsByMobile(organisation.id, mobile.id)}>
            <LocationOnIcon className={classes.leftIcon} />View stops
          </Button>
        </Tooltip>
        <Divider className={classes.verticalDivider} />
        {mobile.timetable ? (
          <Tooltip title='Website timetable'>
            <IconButton className={classes.button} onClick={() => this.goToWebsite()}>
              <WebIcon />
            </IconButton>
          </Tooltip>
        ) : null}
      </CardActions>
    </Card>
  )
}

export default MobileCard
