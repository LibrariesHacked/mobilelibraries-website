import React from 'react'

import { Link } from 'react-router-dom'

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import GridOnIcon from '@mui/icons-material/GridOnTwoTone'
import MoreVertIcon from '@mui/icons-material/MoreVertTwoTone'
import WebIcon from '@mui/icons-material/WebTwoTone'

import { useSearchStateValue } from './context/searchState'
import { useViewStateValue } from './context/viewState'

const MobileCard = props => {
  const { mobile, organisation, location } = props
  const [{}, dispatchSearch] = useSearchStateValue() // eslint-disable-line
  const [{}, dispatchView] = useViewStateValue() // eslint-disable-line

  const viewStopsByMobile = (organisationId, mobileId) => {
    dispatchSearch({
      type: 'FilterByMobile',
      organisationId,
      mobileId
    })
  }

  const viewStop = stopId => {
    dispatchSearch({ type: 'SetCurrentStop', currentStopId: stopId })
    dispatchView({ type: 'SetStopDialog', stopDialogOpen: true })
  }

  const displayMobileLibraryInfo = mobileId => {
    dispatchSearch({
      type: 'SetCurrentMobileLibrary',
      mobileLibraryId: mobileId
    })
    dispatchView({
      type: 'SetMobileLibraryDialog',
      mobileLibraryDialogOpen: true
    })
  }

  const stopButton = stop => {
    return (
      <Button color='secondary' onClick={() => viewStop(stop.stopId)}>
        {stop.stopName}
      </Button>
    )
  }

  const offRoadMessage = status => {
    return <Typography>{status.message}</Typography>
  }

  const preRouteMessage = status => {
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

  const atStopMessage = status => {
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

  const betweenStopsMessage = status => {
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

  const postRouteMessage = status => <Typography>{status.message}</Typography>

  let statusMessage = null
  if (location) {
    const status = location.getStatus()
    if (status && status.type === 'offRoad') { statusMessage = offRoadMessage(status) }
    if (status && status.type === 'preRoute') { statusMessage = preRouteMessage(status) }
    if (status && status.type === 'atStop') { statusMessage = atStopMessage(status) }
    if (status && status.type === 'betweenStops') { statusMessage = betweenStopsMessage(status) }
    if (status && status.type === 'postRoute') { statusMessage = postRouteMessage(status) }
  }

  const bull = <span>•</span>

  return (
    <Card elevation={0} sx={{ border: '1px solid #ccc' }}>
      <CardContent>
        <Typography gutterBottom>
          {mobile.numberRoutes +
            ' route' +
            (mobile.numberRoutes > 1 ? 's' : '')}
          {bull}
          {mobile.numberStops + ' stop' + (mobile.numberStops > 1 ? 's' : '')}
        </Typography>
      </CardContent>
      <CardContent>
        <Typography variant='h6' component='h2'>
          {(organisation ? organisation.name + ' ' : '') + mobile.name}
        </Typography>
        {statusMessage}
      </CardContent>
      <CardActions>
        <Tooltip title='See more mobile details'>
          <IconButton
            size='small'
            onClick={() => displayMobileLibraryInfo(mobile.id)}
          >
            <MoreVertIcon />
          </IconButton>
        </Tooltip>
        <Divider />
        <Tooltip title='Mobile library stops'>
          <Button
            component={Link}
            to='/'
            size='small'
            color='primary'
            onClick={() => viewStopsByMobile(organisation.id, mobile.id)}
          >
            <GridOnIcon />
            View stops
          </Button>
        </Tooltip>
        {mobile.timetable
          ? (
            <>
              <Divider />
              <Tooltip title='Website timetable'>
                <IconButton onClick={() => this.goToWebsite()} size='large'>
                  <WebIcon />
                </IconButton>
              </Tooltip>
            </>
            )
          : null}
      </CardActions>
    </Card>
  )
}

export default MobileCard
