// React
import React from 'react'

import { Link } from 'react-router-dom'

// Material UI
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CircularProgress from '@material-ui/core/CircularProgress'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'

// MUI Icons
import LocationOnIcon from '@material-ui/icons/LocationOnTwoTone'
import WebIcon from '@material-ui/icons/WebTwoTone'

// Material UI Styles
import { makeStyles } from '@material-ui/core/styles'

// Helpers
import { MobileLocation } from './helpers/mobiles'

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
  const { mobile, organisation, location, viewStop, viewStopsByMobile } = props

  const stopButton = (stop) => {
    return <Button color='secondary' onClick={() => viewStop({ id: stop.stop_id })}>{stop.stop_name}</Button>
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

  let status = Object.assign(MobileLocation, location)
  if (status && status.type === 'off_road') status = offRoadMessage(status)
  if (status && status.type === 'pre_route') status = preRouteMessage(status)
  if (status && status.type === 'at_stop') status = atStopMessage(status)
  if (status && status.type === 'between_stops') status = betweenStopsMessage(status)
  if (status && status.type === 'post_route') status = postRouteMessage(status)
  if (!status) status = <CircularProgress className={classes.progress} color='secondary' size={30} />
  const bull = <span className={classes.bullet}>•</span>

  return (
    <Card className={classes.card} elevation={0}>
      <CardContent>
        <Typography className={classes.title} color='textSecondary' gutterBottom>
          {mobile.number_routes + ' route' + (mobile.number_routes > 1 ? 's' : '')}
          {bull}
          {mobile.number_stops + ' stop' + (mobile.number_stops > 1 ? 's' : '')}
        </Typography>
        <Typography variant='h6' component='h2'>{(organisation ? organisation.name + ' ' : '') + mobile.name}</Typography>
        {status}
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
